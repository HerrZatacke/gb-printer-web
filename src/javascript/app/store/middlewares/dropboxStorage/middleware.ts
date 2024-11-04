import dayjs from 'dayjs';
import Queue from 'promise-queue';
import type { AnyAction } from 'redux';
import useFiltersStore from '../../../stores/filtersStore';
import useSettingsStore from '../../../stores/settingsStore';
import useInteractionsStore from '../../../stores/interactionsStore';
import getUploadFiles from '../../../../tools/getUploadFiles';
import saveLocalStorageItems, { saveImageFileContent } from '../../../../tools/saveLocalStorageItems';
import DropboxClient from '../../../../tools/DropboxClient';
import { hasher } from '../../../../tools/DropboxClient/dropboxContentHasher';
import parseAuthParams from '../../../../tools/parseAuthParams';
import { getPrepareFiles } from '../../../../tools/download';
import { loadImageTiles } from '../../../../tools/loadImageTiles';
import replaceDuplicateFilenames from '../../../../tools/replaceDuplicateFilenames';
import { getFilteredImages } from '../../../../tools/getFilteredImages';
import dateFormatLocale from '../../../../tools/dateFormatLocale';

import { Actions } from '../../actions';
import type { TypedStore } from '../../State';
import type { AddToQueueFn, DBFolderFile, DownloadInfo, UploadFile } from '../../../../../types/Sync';
import { delay } from '../../../../tools/delay';
import type { Image } from '../../../../../types/Image';
import type { DownloadArrayBuffer } from '../../../../tools/download/types';
import type { ConfirmAnsweredAction, ConfirmAskAction } from '../../../../../types/actions/ConfirmActions';
import type { StorageSyncStartAction } from '../../../../../types/actions/LogActions';
import type {
  DropboxLastUpdateAction,
  DropboxSetStorageAction,
  DropboxSettingsImportAction,
} from '../../../../../types/actions/StorageActions';
import type { ImagesUpdateAction } from '../../../../../types/actions/ImageActions';
import { DialoqQuestionType } from '../../../../../types/Dialog';
import type { RepoContents } from '../../../../../types/Export';
import { loadFrameData } from '../../../../tools/applyFrame/frameData';

interface WithContentHash {
  dropboxContentHash: string,
}

const middleware = (store: TypedStore): ((action: AnyAction) => Promise<void>) => {

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

  const checkDropboxStatus = (): void => {
    store.dispatch<StorageSyncStartAction>({
      type: Actions.STORAGE_SYNC_START,
      payload: {
        storageType: 'dropbox',
        direction: 'diff',
      },
    });
  };

  const dropboxClient = new DropboxClient(store.getState().dropboxStorage, addToQueue('Dropbox'), store.dispatch);

  if (store.getState().dropboxStorage.autoDropboxSync) {
    // check dropbox for updates
    checkDropboxStatus();

    // check dropbox for updates
    dropboxClient.on('settingsChanged', () => {
      checkDropboxStatus();
    });
  }

  dropboxClient.on('loginDataUpdate', (data) => {
    store.dispatch<DropboxSetStorageAction>({
      type: Actions.SET_DROPBOX_STORAGE,
      payload: {
        ...store.getState().dropboxStorage,
        ...data,
      },
    });
  });

  const { dropboxCode } = parseAuthParams();
  if (dropboxCode) {
    dropboxClient.codeAuth(dropboxCode);
  }

  return async (action: AnyAction): Promise<void> => {
    const state = store.getState();
    const { preferredLocale } = useSettingsStore.getState();

    try {

      switch (action.type) {
        case Actions.SET_DROPBOX_STORAGE: {
          dropboxClient.setRootPath(state.dropboxStorage.path || '/');
          break;
        }

        case Actions.STORAGE_SYNC_START: {
          setSyncBusy(true);
          setSyncSelect(false);

          switch (action.payload.storageType) {
            case 'dropbox': {
              const repoContents: RepoContents =
                await dropboxClient.getRemoteContents(action.payload.direction);

              switch (action.payload.direction) {
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

                  if (lastUpdate > state?.syncLastUpdate?.local) {
                    store.dispatch<ConfirmAskAction>({
                      type: Actions.CONFIRM_ASK,
                      payload: {
                        message: 'There is newer content in your dropbox!',
                        questions: () => [
                          `Your dropbox contains changes from ${dateFormatLocale(dayjs(lastUpdate * 1000), preferredLocale)}`,
                          `Your last local update was ${state?.syncLastUpdate?.local ? (dateFormatLocale(dayjs(state.syncLastUpdate.local * 1000), preferredLocale)) : 'never'}.`,
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
                  const lastUpdateUTC = state?.syncLastUpdate?.local || Math.floor((new Date()).getTime() / 1000);
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

              if (action.payload.direction === 'diff') {
                setSyncBusy(false);
                resetProgressLog();
              } else {
                setProgressLog('dropbox', {
                  timestamp: (new Date()).getTime() / 1000,
                  message: '.',
                });
                setSyncBusy(false);
              }


              break;
            }

            case 'dropboximages': {
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

              if (action.payload.direction === 'up') {
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

              } else {
                throw new Error('dropbox sync: wrong sync case');
              }

              break;
            }

            default:
              break;
          }

          break;
        }

        case Actions.DROPBOX_START_AUTH: {
          dropboxClient.startAuth();
          break;
        }

        case Actions.TRY_RECOVER_IMAGE_DATA: {
          if (!recoveryAttempts.includes(action.payload)) {
            // only attempt once to recover file
            recoveryAttempts.push(action.payload);

            const remoteFileContent = await dropboxClient.getFileContent(`images/${action.payload}.txt`, 0, 1, true);
            await saveImageFileContent(remoteFileContent);

            store.dispatch<ImagesUpdateAction>({
              type: Actions.UPDATE_IMAGES,
              payload: [],
            });
          }

          break;
        }

        default:
      }
    } catch (error) {
      console.error(error);
      useInteractionsStore.getState().setError(error as Error);
    }
  };
};

export default middleware;
