import mime from 'mime-types';
import OctoClient from '../../../../tools/OctoClient';
import loadImageTiles from '../../../../tools/loadImageTiles';
import getImagePalette from '../../../../tools/getImagePalette';
import getPrepareFiles from '../../../../tools/download/getPrepareFiles';
import getSettings from '../../../../tools/getSettings';

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

      const prepareFiles = getPrepareFiles({
        ...state,
        exportScaleFactors: [1],
        exportFileTypes: ['png', 'txt'],
        exportCropFrame: false,
      });

      Promise.all(
        state.images
          .map((image) => (
            loadImageTiles(image, state)
              .then((tiles) => (
                prepareFiles(getImagePalette(state, image), image)(tiles)
                  .then((files) => ({
                    ...image,
                    files,
                  }))
              ))
          )),
      )

        .then((imageCollection) => {
          const toUpload = [];

          imageCollection.forEach(({ hash, files, hashes }) => {
            toUpload.push(...files.map(({ blob, title }) => {
              const extension = mime.extension(blob.type);
              const folder = extension === 'txt' ? 'images' : extension;

              return ({
                destination: `${folder}/${hash}.${extension}`,
                blob,
                extension,
                title,
                hash: hashes ? null : hash,
              });
            }));
          });

          const md = toUpload
            .filter(({ extension }) => extension === 'png')
            .map(({
              destination,
              hash,
              title,
            }) => (
              hash ?
                `[![${title}](${destination} "${title}")](images/${hash}.txt)` :
                `![${title}](${destination} "${title}")`
            ))
            .join('\n');

          const remoteSettings = getSettings('remote');

          toUpload.push(
            {
              destination: 'readme.md',
              blob: new Blob([...md], { type: 'text/plain' }),
            },
            {
              destination: 'settings.json',
              blob: new Blob([...remoteSettings], { type: 'application/json' }),
            },
          );

          return toUpload.filter(Boolean);
        })

        .then((files) => (
          octoClient.getRepoContents()
            .then(({ images, png }) => ({
              // ToDo: is an update possible for PNGs if palette has changed
              // remove all files from upload queue if they already exist remotely
              files: files.filter(({ destination }) => (
                !images.find(({ path }) => path === destination) &&
                !png.find(({ path }) => path === destination)
              )),
              del: [...images, ...png].filter(({ path }) => (
                !files.find(({ destination }) => path === destination)
              )),
            }))
        ))

        .then(({ files, del }) => (
          octoClient.updateRemoteStore({ files, del })
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
