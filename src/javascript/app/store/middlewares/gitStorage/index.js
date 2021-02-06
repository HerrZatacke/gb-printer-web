import OctoClient from '../../../../tools/OctoClient';
import getUploadImages from './getUploadImages';
import prepareGitFiles from './prepareGitFiles';
import filterDeleteNew from './filterDeleteNew';
import saveLocalStorageItems from './saveLocalStorageItems';

const gitStorage = (store) => {
  const { gitStorage: gitStorageSettings } = store.getState();

  const octoClient = new OctoClient(gitStorageSettings);

  octoClient.on('progress', (progress) => {
    store.dispatch({
      type: 'GITSTORAGE_PROGRESS',
      payload: progress,
    });
  });

  return (next) => (action) => {

    if (action.type === 'SET_GIT_STORAGE') {
      octoClient.setOctokit(action.payload);
    }

    if (action.type === 'GITSTORAGE_SYNC_START') {
      const state = store.getState();

      octoClient.getRepoContents()
        .then((repoContents) => {
          switch (action.payload) {
            case 'up':
              return getUploadImages(state)
                .then(({ missingLocally, imageCollection }) => {
                  const gitFiles = prepareGitFiles(imageCollection);
                  return filterDeleteNew(repoContents, gitFiles, missingLocally);
                })
                .then((changes) => (
                  octoClient.updateRemoteStore(changes)
                ));
            case 'down':
              return saveLocalStorageItems(octoClient)(repoContents)
                .then(() => {
                  store.dispatch({
                    type: 'SETTINGS_IMPORT',
                    payload: repoContents.settings,
                  });
                });
            default:
              return Promise.reject(new Error('wrong sync case'));
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
            type: 'GITSTORAGE_SYNC_DONE',
            payload: syncResult,
          });
        });
    }

    next(action);
  };
};

export default gitStorage;
