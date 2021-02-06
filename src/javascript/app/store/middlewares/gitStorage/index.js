import OctoClient from '../../../../tools/OctoClient';
import getUploadImages from './getUploadImages';
import prepareGitFiles from './prepareGitFiles';
import filterDeleteNew from './filterDeleteNew';

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
                .then(prepareGitFiles)
                .then((files) => (
                  filterDeleteNew(repoContents, files)
                ))
                .then((changes) => (
                  octoClient.updateRemoteStore(changes)
                ));
            case 'down':
              store.dispatch({
                type: 'SETTINGS_IMPORT',
                payload: repoContents.settings,
              });
              return repoContents;
            default:
              return null;
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
