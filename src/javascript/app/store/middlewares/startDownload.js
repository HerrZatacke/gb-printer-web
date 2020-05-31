import { load } from '../../../tools/storage';
import { getPrepareFiles } from '../../../tools/download';
import download from '../../../tools/download/download';
import generateFileName from '../../../tools/generateFileName';
import getRGBNFrames from '../../../tools/getRGBNFrames';

const loadImageTiles = ({ hash, frame, hashes }, state) => {
  if (!hashes) {
    return load(hash, frame);
  }

  const frames = getRGBNFrames(state, hashes, frame);

  return Promise.all([
    load(hashes.r, frames.r || frame),
    load(hashes.g, frames.g || frame),
    load(hashes.b, frames.b || frame),
    load(hashes.n, frames.n || frame),
  ]);
};

const getImagePalette = ({ palettes }, { hashes, palette }) => (
  (!hashes) ? palettes.find(({ shortName }) => shortName === palette) : palette
);

const handleSingleImage = (prepareFiles, state) => (imageHash) => {
  const image = state.images.find(({ hash }) => hash === imageHash);
  const imagePalette = getImagePalette(state, image);
  const zipFilename = generateFileName({
    image,
    palette: imagePalette,
  });

  return loadImageTiles(image, state)
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

    return loadImageTiles(image, state)
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
