import OctoClient from '../../../tools/OctoClient';
import { load } from '../../../tools/storage';
import getImagePalette from '../../../tools/getImagePalette';
import getPrepareFiles from '../../../tools/download/getPrepareFiles';

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

    const state = store.getState();

    const { exportScaleFactors, exportFileTypes, exportCropFrame } = state;

    if (action.type === 'SET_GIT_STORAGE') {
      octoClient.setOctokit(action.payload);
    }

    if (action.type === 'GITSTORAGE_STARTSYNC') {

      const prepareFiles = getPrepareFiles(exportScaleFactors, exportFileTypes, exportCropFrame);

      Promise.all(
        state.images
          .filter(({ hashes }) => (!hashes))
          .map((image) => (
            load(image.hash)
              .then((tiles) => ({
                ...image,
                tiles,
              }))
              .then((img) => (
                prepareFiles(getImagePalette(state, image), img)(img.tiles)
                  .then((imageFiles) => ({
                    ...img,
                    imageFile: imageFiles[0].blob,
                  }))
              ))
          )),
      )
        .then((images) => (
          octoClient.updateRemoteStore({ images })
        ))
        .catch((error) => {
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
