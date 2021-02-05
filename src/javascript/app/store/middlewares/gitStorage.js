import OctoClient from '../../../tools/OctoClient';
import loadImageTiles from '../../../tools/loadImageTiles';
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

    // const { exportScaleFactors, exportFileTypes, exportCropFrame } = state;

    if (action.type === 'SET_GIT_STORAGE') {
      octoClient.setOctokit(action.payload);
    }

    if (action.type === 'GITSTORAGE_STARTSYNC') {

      // const prepareFiles = getPrepareFiles(exportScaleFactors, exportFileTypes, exportCropFrame);
      const prepareFiles = getPrepareFiles([1], ['png'], false);

      Promise.all(
        state.images
          // .filter(({ hashes }) => (!hashes))
          .map((image) => (
            loadImageTiles(image, state)
              .then((tiles) => ({
                ...image,
                tiles,
              }))
              .then((img) => (
                prepareFiles(getImagePalette(state, image), img)(img.tiles)
                  .then((imageFiles) => ({
                    ...img,
                    imageFiles,
                  }))
              ))
          )),
      )

        .then((imageCollection) => {
          const toUpload = [];
          const pngNames = [];

          imageCollection.forEach(({ hash, hashes, tiles, imageFiles }) => {
            if (!hashes) {
              toUpload.push({
                destination: `images/${hash}.txt`,
                blob: new Blob([tiles.join('\n')], { type: 'text/plain' }),
              });
            }

            const pngs = imageFiles.map(({ blob }) => ({
              destination: `png/${hash}.png`,
              blob,
            }));

            toUpload.push(...pngs);
            pngNames.push(...pngs.map(({ destination }) => ({
              destination,
              hash: !hashes ? hash : null,
            })));
          });

          const md = pngNames.map(({
            destination,
            hash,
          }) => (
            hash ?
              `[![](${destination})](images/${hash}.txt)` :
              `![](${destination})`
          )).join('\n');

          // toUpload.push({
          //   destination: 'readme.md',
          //   blob: new Blob([...md], { type: 'text/plain' }),
          // });

          return [{
            destination: 'readme.md',
            blob: new Blob([...md], { type: 'text/plain' }),
          }];

          // return toUpload.filter(Boolean);
        })

        .then((files) => (
          // ToDo: Delete outdated images
          // ToDo: Do not upload existing images
          octoClient.updateRemoteStore({ files })
            .then((result) => {
              // eslint-disable-next-line no-console
              console.info(result);
            })
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
