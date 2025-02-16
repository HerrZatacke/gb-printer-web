import dayjs from 'dayjs';
import Queue from 'promise-queue';
import useDialogsStore from '../../app/stores/dialogsStore';
import useFiltersStore from '../../app/stores/filtersStore';
import useInteractionsStore from '../../app/stores/interactionsStore';
import useItemsStore from '../../app/stores/itemsStore';
import useSettingsStore from '../../app/stores/settingsStore';
import useStoragesStore from '../../app/stores/storagesStore';
import DropboxClient from './DropboxClient';
import getUploadFiles from '../getUploadFiles';
import saveLocalStorageItems, { saveImageFileContent } from '../saveLocalStorageItems';
import parseAuthParams from '../parseAuthParams';
import replaceDuplicateFilenames from '../replaceDuplicateFilenames';
import dateFormatLocale from '../dateFormatLocale';
import { hasher } from './DropboxClient/dropboxContentHasher';
import { getPrepareFiles } from '../download';
import { loadImageTiles } from '../loadImageTiles';
import { getFilteredImages } from '../getFilteredImages';
import { delay } from '../delay';
import { DialoqQuestionType } from '../../../types/Dialog';
import { loadFrameData } from '../applyFrame/frameData';
import type { AddToQueueFn, DBFolderFile, DownloadInfo, DropBoxSettings, UploadFile } from '../../../types/Sync';
import type { Image } from '../../../types/Image';
import type { DownloadArrayBuffer } from '../download/types';
import type { RepoContents } from '../../../types/Export';
import type { UseStores } from '../../hooks/useStores';
import type { JSONExportState } from '../../../types/ExportState';
import type { DropBoxSyncTool } from './index';

interface WithContentHash {
  dropboxContentHash: string,
}

const recoveryAttempts: string[] = [];

export const dropBoxSyncTool = (
  stores: UseStores,
  remoteImport: (repoContents: JSONExportState) => Promise<void>,
): DropBoxSyncTool => {
  const { setProgressLog, resetProgressLog, setSyncBusy, setSyncSelect } = useInteractionsStore.getState();
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
              `Your dropbox contains changes from ${dateFormatLocale(dayjs(lastUpdate * 1000), preferredLocale)}`,
              `Your last local update was ${syncLastUpdate?.local ? (dateFormatLocale(dayjs(syncLastUpdate.local * 1000), preferredLocale)) : 'never'}.`,
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
