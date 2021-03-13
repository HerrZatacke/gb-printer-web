import Queue from 'promise-queue';
import OctoClient from '../../../../tools/OctoClient';
import getUploadImages from '../../../../tools/getUploadImages';
import saveLocalStorageItems from '../../../../tools/saveLocalStorageItems';

let octoClient;
let addToQueue = () => {};

const init = (store) => {
  const { gitStorage: gitStorageSettings } = store.getState();

  const queue = new Queue(1, Infinity);
  addToQueue = (who) => (what, throttle, fn) => (
    queue.add(() => (
      new Promise((resolve, reject) => {
        window.setTimeout(() => {
          store.dispatch({
            type: 'GITSTORAGE_LOG_ACTION',
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

  octoClient = new OctoClient(gitStorageSettings, addToQueue('OctoClient'));
};


const middleware = (store) => (action) => {
  if (
    action.type === 'STORAGE_SYNC_START' &&
    action.payload.storageType === 'git'
  ) {
    octoClient.getRepoContents()
      .then((repoContents) => {
        switch (action.payload.direction) {
          case 'up':
            return getUploadImages(store, repoContents, addToQueue('GBPrinter'))
              .then(octoClient.updateRemoteStore.bind(octoClient));
          case 'down':
            return saveLocalStorageItems(repoContents)
              .then((result) => {
                store.dispatch({
                  type: 'GIT_SETTINGS_IMPORT',
                  payload: repoContents.settings,
                });

                return result;
              });
          default:
            return Promise.reject(new Error('github sync: wrong sync case'));
        }
      })
      .catch((error) => {
        console.error(error);
        store.dispatch({
          type: 'ERROR',
          payload: error.message,
        });
        return error.message;
      })
      .then((syncResult) => {
        store.dispatch({
          type: 'STORAGE_SYNC_DONE',
          payload: {
            syncResult,
            storageType: 'git',
          },
        });
      });
  } else if (action.type === 'SET_GIT_STORAGE') {
    octoClient.setOctokit(action.payload);
  }
};

export {
  init,
  middleware,
};
