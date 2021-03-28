import Queue from 'promise-queue';
import getUploadImages from '../../../../tools/getUploadImages';
import saveLocalStorageItems from '../../../../tools/saveLocalStorageItems';
import DropboxClient from '../../../../tools/DropboxClient';
import createDropboxContentHasher from '../../../../tools/DropboxClient/createDropboxContentHasher';
import parseAuthParams from '../../../../tools/parseAuthParams';
import { getPrepareFiles } from '../../../../tools/download';
import getImagePalette from '../../../../tools/getImagePalette';
import loadImageTiles from '../../../../tools/loadImageTiles';
import replaceDuplicateFilenames from '../../../../tools/replaceDuplicateFilenames';
import getFilteredImages from '../../../../tools/getFilteredImages';

let dropboxClient;
let addToQueue = () => {};

const middleware = (store, dropboxStorage) => {

  const queue = new Queue(1, Infinity);
  addToQueue = (who) => (what, throttle, fn) => (
    queue.add(() => (
      new Promise((resolve, reject) => {
        window.setTimeout(() => {
          store.dispatch({
            type: 'DROPBOX_LOG_ACTION',
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

  dropboxClient = new DropboxClient(dropboxStorage, addToQueue('Dropbox'));

  dropboxClient.on('loginDataUpdate', (data) => {
    store.dispatch({
      type: 'SET_DROPBOX_STORAGE',
      payload: {
        ...dropboxStorage,
        ...data,
      },
    });
  });

  const { dropboxCode } = parseAuthParams();
  if (dropboxCode) {
    dropboxClient.codeAuth(dropboxCode);
  }

  return (action) => {
    if (action.type === 'STORAGE_SYNC_START') {
      dropboxClient.setRootPath(store.getState().dropboxStorage.path || '/');

      if (action.payload.storageType === 'dropbox') {

        dropboxClient.getRemoteContents()
          .then((repoContents) => {
            switch (action.payload.direction) {
              case 'up':
                return getUploadImages(store, repoContents, addToQueue('GBPrinter'))
                  .then((changes) => dropboxClient.upload(changes), 'settings');
              case 'down':
                return saveLocalStorageItems(repoContents)
                  .then((result) => {
                    store.dispatch({
                      type: 'DROPBOX_SETTINGS_IMPORT',
                      payload: repoContents.settings,
                    });

                    return result;
                  });
              default:
                return Promise.reject(new Error('dropbox sync: wrong sync case'));
            }
          })
          .then((syncResult) => {
            store.dispatch({
              type: 'STORAGE_SYNC_DONE',
              payload: {
                syncResult,
                storageType: 'dropbox',
              },
            });
          })
          .catch((error) => {
            console.error(error);
            store.dispatch({
              type: 'ERROR',
              payload: error.message,
            });
          });

      } else

      if (action.payload.storageType === 'dropboximages') {

        const state = store.getState();
        const images = getFilteredImages(state);
        const prepareFiles = getPrepareFiles(state);
        const loadTiles = loadImageTiles(state);

        Promise.all(images/* .slice(0, 5) */.map((image, index) => (
          addToQueue('Generate images and hashes')(`${index}/${images.length}`, 0, () => {
            const imagePalette = getImagePalette(state, image);
            return loadTiles(image)
              .then(prepareFiles(imagePalette, image))
              .then((imageBlobs) => Promise.all(imageBlobs.map((imageB) => {
                const hasher = createDropboxContentHasher();
                return imageB.blob.arrayBuffer()
                  .then((arrayBuffer) => {
                    hasher.update(arrayBuffer);
                    return ({
                      ...imageB,
                      dropboxContentHash: hasher.digest('hex'),
                    });
                  });
              })));
          })
        )))
          .then((resultImages) => resultImages.flat())
          .then(replaceDuplicateFilenames)
          .then((hashedImages) => (
            dropboxClient.getImageContents()
              .then((imageContents) => {
                switch (action.payload.direction) {
                  case 'up': {
                    const missingImages = hashedImages
                      .filter(({ dropboxContentHash, uFilename }) => {

                        // check for remote image with same hash AND filename
                        const exactImage = imageContents.find(({ content_hash: contentHash, name: filename }) => (
                          (contentHash === dropboxContentHash) &&
                          (filename === uFilename)
                        ));

                        // exact image not found -> has to remain in "missingImages"
                        return !exactImage;
                      })
                      .map((image) => ({
                        ...image,
                        destination: image.uFilename,
                      }));

                    return dropboxClient.upload({ upload: missingImages, del: [] }, 'images');
                  }

                  default:
                    return Promise.reject(new Error('dropbox sync: wrong sync case'));
                }
              })
          ))

          .then((syncResult) => {
            store.dispatch({
              type: 'STORAGE_SYNC_DONE',
              payload: {
                syncResult,
                storageType: 'dropbox',
              },
            });
          })
          .catch((error) => {
            console.error(error);
            store.dispatch({
              type: 'ERROR',
              payload: error.message,
            });
          });

      }

    } else if (action.type === 'DROPBOX_START_AUTH') {
      dropboxClient.startAuth();
    }
  };
};

export default middleware;
