import { getPrepareFiles } from '../../../tools/download';
import download from '../../../tools/download/download';
import generateFileName from '../../../tools/generateFileName';
import loadImageTiles from '../../../tools/loadImageTiles';
import getImagePalette from '../../../tools/getImagePalette';
import { Actions } from '../actions';

const handleSingleImage = (prepareFiles, state) => (imageHash) => {
  const image = state.images.find(({ hash }) => hash === imageHash);
  const imagePalette = getImagePalette(state, image);
  const zipFilename = generateFileName({
    image,
    palette: imagePalette,
  });

  return loadImageTiles(state)(image)
    .then(prepareFiles(imagePalette, image))
    .then(download(zipFilename));
};

const handleImageCollection = (prepareFiles, state) => (collection) => {
  const zipFilename = generateFileName({
    altTitle: 'gameboy-printer-gallery',
    useCurrentDate: true,
  });

  Promise.all(collection.map((imageHash) => {
    const image = state.images.find(({ hash }) => hash === imageHash);
    const imagePalette = getImagePalette(state, image);

    return loadImageTiles(state)(image)
      .then(prepareFiles(imagePalette, image));
  }))
    .then((resultImages) => resultImages.flat())
    .then(download(zipFilename));
};

const startDownload = (store) => (next) => (action) => {

  if ((action.type === Actions.START_DOWNLOAD) || (action.type === Actions.DOWNLOAD_SELECTION)) {
    const state = store.getState();

    const prepareFiles = getPrepareFiles(state);

    switch (action.type) {
      case Actions.START_DOWNLOAD:
        handleSingleImage(prepareFiles, state)(action.payload);
        break;

      case Actions.DOWNLOAD_SELECTION:
        handleImageCollection(prepareFiles, state)(action.payload);
        break;

      default:
        break;
    }
  }

  return next(action);
};

export default startDownload;
