import Queue from 'promise-queue';
import { DialoqQuestionType } from '@/consts/dialog';
import type { UseStores } from '@/hooks/useStores';
import useDialogsStore from '@/stores/dialogsStore';
import useFiltersStore from '@/stores/filtersStore';
import useInteractionsStore from '@/stores/interactionsStore';
import useItemsStore from '@/stores/itemsStore';
import useProgressStore from '@/stores/progressStore';
import useSettingsStore from '@/stores/settingsStore';
import useStoragesStore from '@/stores/storagesStore';
import { delay } from '@/tools/delay';
import { getPrepareFiles } from '@/tools/download';
import { getFilteredImages } from '@/tools/getFilteredImages';
import getUploadFiles from '@/tools/getUploadFiles';
import { loadImageTiles } from '@/tools/loadImageTiles';
import parseAuthParams from '@/tools/parseAuthParams';
import replaceDuplicateFilenames from '@/tools/replaceDuplicateFilenames';
import saveLocalStorageItems, { saveImageFileContent } from '@/tools/saveLocalStorageItems';
import { DownloadArrayBuffer } from '@/types/download';
import type { RepoContents } from '@/types/Export';
import type { JSONExportState } from '@/types/ExportState';
import type { Image } from '@/types/Image';
import type { AddToQueueFn, DBFolderFile, DownloadInfo, DropBoxSettings, UploadFile } from '@/types/Sync';
import { loadFrameData } from '../applyFrame/frameData';
import DropboxClient from './DropboxClient';
import { hasher } from './DropboxClient/dropboxContentHasher';
import type { DropBoxSyncTool } from './index';

interface WithContentHash {
  dropboxContentHash: string,
}

const recoveryAttempts: string[] = [];

export const dropBoxSyncTool = (
  stores: UseStores,
  remoteImport: (repoContents: JSONExportState) => Promise<void>,
): DropBoxSyncTool => {
  const { setSyncBusy, setSyncSelect } = useInteractionsStore.getState();
  const { setProgressLog, resetProgressLog } = useProgressStore.getState();
  const { dismissDialog, setDialog } = useDialogsStore.getState();

  const queue = new Queue(1, Infinity);
  const addToQueue = (who: string): AddToQueueFn<unknown> => (
    what: string,
    throttle: number,
    fn: () => Promise<unknown>,
    isSilent?: boolean,
  ) => (
    queue.add(async () => {
      await delay(throttle);
      if (!isSilent) {
        setProgressLog('dropbox', {
          timestamp: (new Date()).getTime() / 1000,
          message: `${who} runs ${what}`,
        });
      }

      return fn();
    })
  );

  const dropboxClient = new DropboxClient(useStoragesStore.getState().dropboxStorage, addToQueue('Dropbox'));

  const updateSettings = async (dropBoxSettings: DropBoxSettings) => {
    await dropboxClient.setRootPath(dropBoxSettings.path || '/');
  };

  const startSyncData = async (direction: 'up' | 'down' | 'diff') => {
    setSyncBusy(true);
    setSyncSelect(false);

    const { preferredLocale } = useSettingsStore.getState();
    const { syncLastUpdate } = useStoragesStore.getState();
    const repoContents: RepoContents = await dropboxClient.getRemoteContents(direction);

    switch (direction) {
      case 'diff': {
        if (repoContents?.settings?.state?.lastUpdateUTC === null) {
          break;
        }

        const lastUpdate = (repoContents.settings.state?.lastUpdateUTC === undefined) ?
          (Date.now() / 1000) :
          repoContents.settings.state.lastUpdateUTC;

        useStoragesStore.getState().setSyncLastUpdate('dropbox', lastUpdate);

        if (lastUpdate > syncLastUpdate?.local) {
          setDialog({
            message: 'There is newer content in your dropbox!',
            questions: () => [
              `Your dropbox contains changes from ${(new Date(lastUpdate * 1000)).toLocaleString(preferredLocale)}`,
              `Your last local update was ${syncLastUpdate?.local ? ((new Date(syncLastUpdate.local * 1000)).toLocaleString(preferredLocale)) : 'never'}.`,
              'Do you want to load the changes?',
            ]
              .map((label, index) => ({
                label,
                key: `info${index}`,
                type: DialoqQuestionType.INFO,
              })),
            confirm: async () => {
              dismissDialog(0);
              startSyncData('down');
            },
            deny: async () => dismissDialog(0),
          });
        }

        break;
      }

      case 'up': {
        const lastUpdateUTC = syncLastUpdate?.local || Math.floor((new Date()).getTime() / 1000);
        const changes = await getUploadFiles(repoContents, lastUpdateUTC, addToQueue('GBPrinter'));
        await dropboxClient.upload(changes, 'settings');
        useStoragesStore.getState().setSyncLastUpdate('dropbox', lastUpdateUTC);
        break;
      }

      case 'down': {
        const syncedState = await saveLocalStorageItems(repoContents);
        remoteImport(syncedState);

        const lastUpdate = repoContents.settings?.state?.lastUpdateUTC || 0;
        if (lastUpdate) {
          useStoragesStore.getState().setSyncLastUpdate('dropbox', lastUpdate);

          // Local time is set in useStores->combinedGlobalUpdate
          // useStoragesStore.getState().setSyncLastUpdate('local', lastUpdate);
        }

        break;
      }

      default:
        throw new Error('dropbox sync: wrong sync case');
    }

    if (direction !== 'diff') {
      setProgressLog('dropbox', {
        timestamp: (new Date()).getTime() / 1000,
        message: '.',
      });
    } else {
      resetProgressLog();
    }

    setSyncBusy(false);
  };


  const startSyncImages = async () => {
    setSyncBusy(true);
    setSyncSelect(false);

    const { frames, palettes, images: stateImages } = useItemsStore.getState();

    const { exportScaleFactors, exportFileTypes, handleExportFrame, fileNameStyle } = useSettingsStore.getState();
    const filtersState = useFiltersStore.getState();
    const images: Image[] = getFilteredImages(stateImages, filtersState);
    const prepareFiles = getPrepareFiles(
      exportScaleFactors,
      exportFileTypes,
      handleExportFrame,
      palettes,
      fileNameStyle,
    );
    const loadTiles = loadImageTiles(stateImages, frames);

    const downloadInfos = (await Promise.all(
      images.map(async (image, index): Promise<unknown> => (
        addToQueue('Generate images and hashes')(`${index + 1}/${images.length}`, 10, async () => {
          const tiles = await loadTiles(image.hash);

          const frame = frames.find(({ id }) => id === image.frame);
          const frameData = frame ? await loadFrameData(frame?.hash) : null;
          const imageStartLine = frameData ? frameData.upper.length / 20 : 2;

          if (!tiles) {
            throw new Error('tiles missing');
          }

          const imageBlobs = await prepareFiles(image)(tiles, imageStartLine);

          const result = await Promise.all(
            imageBlobs.map(async (dlInfo: DownloadInfo): Promise<DownloadArrayBuffer> => ({
              filename: dlInfo.filename,
              arrayBuffer: await dlInfo.blob.arrayBuffer(),
            })),
          );
          return result;
        })
      )),
    )).flat() as DownloadArrayBuffer[];


    const cleanedFilenames = replaceDuplicateFilenames(downloadInfos);

    const hashedImages = await Promise.all(
      cleanedFilenames.map(async (img): Promise<DownloadArrayBuffer & WithContentHash> => ({
        ...img,
        dropboxContentHash: await hasher(img.arrayBuffer),
      })),
    );

    const remoteContents: DBFolderFile[] = await dropboxClient.getImageContents();

    const toUpload = hashedImages
      .reduce((acc: UploadFile[], image: DownloadArrayBuffer & WithContentHash): UploadFile[] => {
        const { arrayBuffer, dropboxContentHash, filename } = image;
        if (remoteContents.findIndex(({ content_hash: contentHash, name }: DBFolderFile) => (
          (contentHash === dropboxContentHash) &&
          (name === filename)
        )) === -1) { // image not found in Dropbox list
          return [...acc, {
            blob: new Blob([arrayBuffer]),
            destination: filename,
          }];
        }

        return acc;
      }, []);

    await dropboxClient.upload({ upload: toUpload, del: [] }, 'images');
    setProgressLog('dropbox', {
      timestamp: (new Date()).getTime() / 1000,
      message: '.',
    });

    setSyncBusy(false);
  };


  const recoverImageData = async (hash: string) => {
    const { updateImages } = stores;
    if (!recoveryAttempts.includes(hash)) {
      // only attempt once to recover file
      recoveryAttempts.push(hash);

      const remoteFileContent = await dropboxClient.getFileContent(`images/${hash}.txt`, 0, 1, true);
      await saveImageFileContent(remoteFileContent);

      // ToDo find a way to better trigger update (if it is even necessary ??)
      updateImages([]);
    }
  };

  const checkDropboxStatus = (): void => {
    startSyncData('diff');
  };

  if (useStoragesStore.getState().dropboxStorage.autoDropboxSync) {
    // check dropbox for updates
    checkDropboxStatus();

    // check dropbox for updates
    dropboxClient.on('settingsChanged', () => {
      checkDropboxStatus();
    });
  }

  dropboxClient.on('loginDataUpdate', (data) => {
    const { setDropboxStorage } = useStoragesStore.getState();
    setDropboxStorage(data);
  });

  const { dropboxCode } = parseAuthParams();
  if (dropboxCode) {
    dropboxClient.codeAuth(dropboxCode);
  }

  useStoragesStore.subscribe((state) => state.dropboxStorage, updateSettings);

  return {
    updateSettings,
    startSyncData,
    startSyncImages,
    startAuth: () => dropboxClient.startAuth(),
    recoverImageData,
  };
};
