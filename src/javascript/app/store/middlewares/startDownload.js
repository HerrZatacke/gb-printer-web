import { load } from '../../../tools/storage';
import { getPrepareFiles } from '../../../tools/download';
import download from '../../../tools/download/download';
import generateFileName from '../../../tools/generateFileName';

const loadImageData = ({ hash, hashes }) => {
  if (!hashes) {
    // default type image
    return load(hash);
  }

  // rgbn image
  return Promise.all([
    load(hashes.r),
    load(hashes.g),
    load(hashes.b),
    load(hashes.n),
  ]);
};

const getImagePalette = ({ palettes }, { hashes, palette }) => (
  (!hashes) ? palettes.find(({ shortName }) => shortName === palette) : palette
);


const handleSingleImage = (prepareFiles, state) => (imageHash) => {
  const image = state.images.find(({ hash }) => hash === imageHash);
  const imagePalette = getImagePalette(state, image);
  const zipFilename = generateFileName(image, imagePalette);

  return loadImageData(image)
    .then(prepareFiles(imagePalette, image))
    .then(download(zipFilename));
};

const handleImageCollection = (prepareFiles, state) => (collection) => {
  const zipFilename = 'so.many.files';

  Promise.all(collection.map((imageHash) => {
    const image = state.images.find(({ hash }) => hash === imageHash);
    const imagePalette = getImagePalette(state, image);

    return loadImageData(image)
      .then(prepareFiles(imagePalette, image));
  }))
    .then((resultImages) => resultImages.flat())
    .then(download(zipFilename));
};

const startDownload = (store) => (next) => (action) => {

  if ((action.type === 'START_DOWNLOAD') || (action.type === 'DOWNLOAD_SELECTION')) {
    const state = store.getState();
    const exportScaleFactors = state.exportScaleFactors;

    if (exportScaleFactors.length === 0) {
      return null;
    }

    const prepareFiles = getPrepareFiles(exportScaleFactors);

    switch (action.type) {
      case 'START_DOWNLOAD':
        handleSingleImage(prepareFiles, state)(action.payload);
        break;

      case 'DOWNLOAD_SELECTION':
        handleImageCollection(prepareFiles, state)(action.payload);
        break;

      default:
        break;
    }
  }

  return next(action);
};

export default startDownload;
