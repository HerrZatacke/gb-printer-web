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

const startDownload = (store) => (next) => (action) => {

  if (action.type === 'START_DOWNLOAD') {
    const state = store.getState();
    const exportScaleFactors = state.exportScaleFactors;

    if (exportScaleFactors.length === 0) {
      return null;
    }

    const prepareFiles = getPrepareFiles(exportScaleFactors);

    const image = state.images.find(({ hash }) => hash === action.payload);
    const imagePalette = getImagePalette(state, image);

    loadImageData(image)
      .then(prepareFiles(imagePalette, image))
      .then(download(generateFileName(image, imagePalette)));

  }

  return next(action);
};

export default startDownload;
