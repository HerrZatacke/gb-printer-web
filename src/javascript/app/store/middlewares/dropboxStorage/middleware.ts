import dayjs from 'dayjs';
import Queue from 'promise-queue';
import type { AnyAction } from 'redux';
import getUploadFiles from '../../../../tools/getUploadFiles';
import saveLocalStorageItems, { saveImageFileContent } from '../../../../tools/saveLocalStorageItems';
import DropboxClient from '../../../../tools/DropboxClient';
import { hasher } from '../../../../tools/DropboxClient/dropboxContentHasher';
import parseAuthParams from '../../../../tools/parseAuthParams';
import { getPrepareFiles } from '../../../../tools/download';
import getImagePalette from '../../../../tools/getImagePalette';
import { loadImageTiles } from '../../../../tools/loadImageTiles';
import replaceDuplicateFilenames from '../../../../tools/replaceDuplicateFilenames';
import getFilteredImages from '../../../../tools/getFilteredImages';
import dateFormatLocale from '../../../../tools/dateFormatLocale';

import { Actions } from '../../actions';
import type { TypedStore } from '../../State';
import type { AddToQueueFn, DBFolderFile, DownloadInfo, UploadFile } from '../../../../../types/Sync';
import { delay } from '../../../../tools/delay';
import type { Image } from '../../../../../types/Image';
import type { DownloadArrayBuffer } from '../../../../tools/download/types';
import type { ConfirmAnsweredAction, ConfirmAskAction } from '../../../../../types/actions/ConfirmActions';
import type { ErrorAction } from '../../../../../types/actions/GlobalActions';
import type {
  LogDropboxAction,
  LogStorageDiffDoneAction,
  LogStorageSyncDoneAction,
  StorageSyncStartAction,
} from '../../../../../types/actions/LogActions';
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
        store.dispatch<LogDropboxAction>({
          type: Actions.DROPBOX_LOG_ACTION,
          payload: {
            timestamp: (new Date()).getTime() / 1000,
            message: `${who} runs ${what}`,
          },
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

    try {

      switch (action.type) {
        case Actions.SET_DROPBOX_STORAGE: {
          dropboxClient.setRootPath(state.dropboxStorage.path || '/');
          break;
        }

        case Actions.STORAGE_SYNC_START: {

          switch (action.payload.storageType) {
            case 'dropbox': {
              const repoContents: RepoContents =
                await dropboxClient.getRemoteContents(action.payload.direction);

              let syncResult;

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
                          `Your dropbox contains changes from ${dateFormatLocale(dayjs(lastUpdate * 1000), state.preferredLocale)}`,
                          `Your last local update was ${state?.syncLastUpdate?.local ? (dateFormatLocale(dayjs(state.syncLastUpdate.local * 1000), state.preferredLocale)) : 'never'}.`,
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
                  syncResult = await dropboxClient.upload(changes, 'settings');

                  store.dispatch<DropboxLastUpdateAction>({
                    type: Actions.LAST_UPDATE_DROPBOX_REMOTE,
                    payload: lastUpdateUTC,
                  });
                  break;
                }

                case 'down': {
                  syncResult = await saveLocalStorageItems(repoContents);
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
                store.dispatch<LogStorageDiffDoneAction>({
                  type: Actions.STORAGE_DIFF_DONE,
                });
              } else {
                store.dispatch<LogStorageSyncDoneAction>({
                  type: Actions.STORAGE_SYNC_DONE,
                  payload: {
                    syncResult,
                    storageType: 'dropbox',
                  },
                });
              }


              break;
            }

            case 'dropboximages': {
              const images: Image[] = getFilteredImages(state, state.images);
              const prepareFiles = getPrepareFiles(state);
              const loadTiles = loadImageTiles(state);

              const downloadInfos = (await Promise.all(
                images.map(async (image, index): Promise<unknown> => (
                  addToQueue('Generate images and hashes')(`${index + 1}/${images.length}`, 10, async () => {
                    const imagePalette = getImagePalette(state, image);
                    const tiles = await loadTiles(image.hash);

                    const frame = state.frames.find(({ id }) => id === image.frame);
                    const frameData = frame ? await loadFrameData(frame?.hash) : null;
                    const imageStartLine = frameData ? frameData.upper.length / 20 : 2;

                    if (!imagePalette || !tiles) {
                      throw new Error('palette or tiles missing');
                    }

                    const imageBlobs = await prepareFiles(imagePalette, image)(tiles, imageStartLine);

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

                const syncResult = await dropboxClient.upload({ upload: toUpload, del: [] }, 'images');
                store.dispatch<LogStorageSyncDoneAction>({
                  type: Actions.STORAGE_SYNC_DONE,
                  payload: {
                    syncResult,
                    storageType: 'dropbox',
                  },
                });

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
      store.dispatch<ErrorAction>({
        type: Actions.ERROR,
        payload: {
          error: error as Error,
          timestamp: dayjs().unix(),
        },
      });
    }
  };
};

export default middleware;
