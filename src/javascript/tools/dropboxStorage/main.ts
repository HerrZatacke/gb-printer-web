import dayjs from 'dayjs';
import Queue from 'promise-queue';
import useFiltersStore from '../../app/stores/filtersStore';
import useSettingsStore from '../../app/stores/settingsStore';
import useInteractionsStore from '../../app/stores/interactionsStore';
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
import { Actions } from '../../app/store/actions';
import type { TypedStore } from '../../app/store/State';
import type { AddToQueueFn, DBFolderFile, DownloadInfo, DropBoxSettings, UploadFile } from '../../../types/Sync';
import type { Image } from '../../../types/Image';
import type { DownloadArrayBuffer } from '../download/types';
import type { ConfirmAnsweredAction, ConfirmAskAction } from '../../../types/actions/ConfirmActions';
import type { StorageSyncStartAction } from '../../../types/actions/LogActions';
import type { DropboxLastUpdateAction, DropboxSettingsImportAction } from '../../../types/actions/StorageActions';
import type { ImagesUpdateAction } from '../../../types/actions/ImageActions';
import type { RepoContents } from '../../../types/Export';

interface WithContentHash {
  dropboxContentHash: string,
}

export interface SyncTool {
  updateSettings: (dropBoxSettings: DropBoxSettings) => Promise<void>,
  startSyncData: (direction: 'up' | 'down' | 'diff') => Promise<void>,
  startSyncImages: () => Promise<void>,
  startAuth: () => Promise<void>,
  recoverImageData: (hash: string) => Promise<void>,
}

export const dropBoxSyncTool = (store: TypedStore): SyncTool => {

  const recoveryAttempts: string[] = [];
  const { setProgressLog, resetProgressLog, setSyncBusy, setSyncSelect } = useInteractionsStore.getState();

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

  const dropboxClient = new DropboxClient(useStoragesStore.getState().dropboxStorage, addToQueue('Dropbox'), store.dispatch);

  const updateSettings = async (dropBoxSettings: DropBoxSettings) => {
    await dropboxClient.setRootPath(dropBoxSettings.path || '/');
  };

  const startSyncData = async (direction: 'up' | 'down' | 'diff') => {
    setSyncBusy(true);
    setSyncSelect(false);

    const { preferredLocale, syncLastUpdate } = useSettingsStore.getState();
    const repoContents: RepoContents = await dropboxClient.getRemoteContents(direction);

    switch (direction) {
      case 'diff': {
        if (repoContents?.settings?.state?.lastUpdateUTC === null) {
          break;
        }

        const lastUpdate = (repoContents.settings.state?.lastUpdateUTC === undefined) ?
          (Date.now() / 1000) :
          repoContents.settings.state.lastUpdateUTC;

        store.dispatch<DropboxLastUpdateAction>({
          type: Actions.LAST_UPDATE_DROPBOX_REMOTE,
          payload: lastUpdate,
        });

        if (lastUpdate > syncLastUpdate?.local) {
          store.dispatch<ConfirmAskAction>({
            type: Actions.CONFIRM_ASK,
            payload: {
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
                store.dispatch<ConfirmAnsweredAction>({
                  type: Actions.CONFIRM_ANSWERED,
                });
                store.dispatch<StorageSyncStartAction>({
                  type: Actions.STORAGE_SYNC_START,
                  payload: {
                    storageType: 'dropbox',
                    direction: 'down',
                  },
                });
              },
              deny: async () => {
                store.dispatch<ConfirmAnsweredAction>({
                  type: Actions.CONFIRM_ANSWERED,
                });
              },
            },
          });
        }

        break;
      }

      case 'up': {
        const lastUpdateUTC = syncLastUpdate?.local || Math.floor((new Date()).getTime() / 1000);
        const changes = await getUploadFiles(store, repoContents, lastUpdateUTC, addToQueue('GBPrinter'));
        await dropboxClient.upload(changes, 'settings');

        store.dispatch<DropboxLastUpdateAction>({
          type: Actions.LAST_UPDATE_DROPBOX_REMOTE,
          payload: lastUpdateUTC,
        });
        break;
      }

      case 'down': {
        await saveLocalStorageItems(repoContents);
        store.dispatch<DropboxSettingsImportAction>({
          type: Actions.DROPBOX_SETTINGS_IMPORT,
          payload: repoContents.settings,
        });
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

    const state = store.getState();

    const { exportScaleFactors, exportFileTypes, handleExportFrame } = useSettingsStore.getState();
    const filtersState = useFiltersStore.getState();
    const images: Image[] = getFilteredImages(state.images, filtersState);
    const prepareFiles = getPrepareFiles(
      exportScaleFactors,
      exportFileTypes,
      handleExportFrame,
      state,
    );
    const loadTiles = loadImageTiles(state);

    const downloadInfos = (await Promise.all(
      images.map(async (image, index): Promise<unknown> => (
        addToQueue('Generate images and hashes')(`${index + 1}/${images.length}`, 10, async () => {
          const tiles = await loadTiles(image.hash);

          const frame = state.frames.find(({ id }) => id === image.frame);
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
    if (!recoveryAttempts.includes(hash)) {
      // only attempt once to recover file
      recoveryAttempts.push(hash);

      const remoteFileContent = await dropboxClient.getFileContent(`images/${hash}.txt`, 0, 1, true);
      await saveImageFileContent(remoteFileContent);

      store.dispatch<ImagesUpdateAction>({
        type: Actions.UPDATE_IMAGES,
        payload: [],
      });
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
