import Queue from 'promise-queue/lib';
import OctoClient from '../../../../tools/OctoClient';
import getUploadImages from '../../../../tools/getUploadImages';
import saveLocalStorageItems from '../../../../tools/saveLocalStorageItems';
import { Actions } from '../../actions';

let octoClient;
let addToQueue = () => {};

const init = (store) => {
  const { gitStorage: gitStorageSettings } = store.getState();

  const getPreferredLocale = () => (
    store.getState().preferredLocale
  );

  const queue = new Queue(1, Infinity);
  addToQueue = (who) => (what, throttle, fn) => (
    queue.add(() => (
      new Promise((resolve, reject) => {
        window.setTimeout(() => {
          store.dispatch({
            type: Actions.GITSTORAGE_LOG_ACTION,
            payload: {
              timestamp: (new Date()).getTime() / 1000,
              message: `${who} runs ${what}`,
            },
          });

          fn()
            .then(resolve)
            .catch(reject);
        }, throttle);
      })
    ))
  );

  octoClient = new OctoClient(gitStorageSettings, getPreferredLocale, addToQueue('OctoClient'));
};


const middleware = (store) => (action) => {
  if (
    action.type === Actions.STORAGE_SYNC_START &&
    action.payload.storageType === 'git'
  ) {
    const state = store.getState();

    octoClient.getRepoContents()
      .then((repoContents) => {
        switch (action.payload.direction) {
          case 'up': {
            const lastUpdateUTC = state?.syncLastUpdate?.local || Math.floor((new Date()).getTime() / 1000);
            return getUploadImages(store, repoContents, lastUpdateUTC, addToQueue('GBPrinter'))
              .then(octoClient.updateRemoteStore.bind(octoClient));
          }

          case 'down': {
            return saveLocalStorageItems(repoContents)
              .then((result) => {
                store.dispatch({
                  type: Actions.GIT_SETTINGS_IMPORT,
                  payload: repoContents.settings,
                });

                return result;
              });
          }

          default:
            return Promise.reject(new Error('github sync: wrong sync case'));
        }
      })
      .then((syncResult) => {
        store.dispatch({
          type: Actions.STORAGE_SYNC_DONE,
          payload: {
            syncResult,
            storageType: 'git',
          },
        });
      })
      .catch((error) => {
        console.error(error);
        store.dispatch({
          type: Actions.ERROR,
          payload: error.message,
        });
      });
  } else if (action.type === Actions.SET_GIT_STORAGE) {
    octoClient.setOctokit(action.payload);
  }
};

export {
  init,
  middleware,
};
