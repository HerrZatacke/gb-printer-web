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

    if (action.type === 'GITSTORAGE_STARTSYNC') {

      const state = store.getState();
      getUploadImages(state)
        .then(prepareGitFiles)

        .then((files) => (
          octoClient.getRepoContents()
            .then(filterDeleteNew(files))
        ))
        .then(({ upload, del }) => (
          octoClient.updateRemoteStore({ upload, del })
            .then((result) => {
              // eslint-disable-next-line no-console
              console.info(result);
            })
        ))
        .catch((error) => {
          console.error(error);
          store.dispatch({
            type: 'ERROR',
            payload: error.message,
          });
        });
    }

    next(action);
  };
};

export default gitStorage;
