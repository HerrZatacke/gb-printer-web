import { getPrepareFiles } from '../../../tools/download';
import download from '../../../tools/download/download';
import generateFileName from '../../../tools/generateFileName';
import loadImageTiles from '../../../tools/loadImageTiles';
import getImagePalette from '../../../tools/getImagePalette';
import { Actions } from '../actions';
import { State } from '../State';
import { PrepareFilesReturnType } from '../../../tools/download/getPrepareFiles';
import { MiddlewareWithState } from '../../../../types/MiddlewareWithState';

const handleSingleImage = (
  prepareFiles: PrepareFilesReturnType,
  state: State,
) => async (imageHash: string): Promise<void> => {
  const image = state.images.find(({ hash }) => hash === imageHash);
  if (!image) {
    throw new Error('image not found');
  }

  const imagePalette = getImagePalette(state, image);
  if (!imagePalette) {
    throw new Error('imagePalette not found');
  }

  const zipFilename = generateFileName({
    image,
    palette: imagePalette,
  });

  const tiles = await loadImageTiles(state)(image);

  if (!tiles) {
    throw new Error('no tiles');
  }

  const files = await prepareFiles(imagePalette, image)(tiles);
  return download(zipFilename)(files);
};

const handleImageCollection =
  (prepareFiles: PrepareFilesReturnType, state: State) => async (collection: string[]): Promise<void> => {
    const zipFilename = generateFileName({
      altTitle: 'gameboy-printer-gallery',
      useCurrentDate: true,
    });

    Promise.all(collection.map(async (imageHash) => {
      const image = state.images.find(({ hash }) => hash === imageHash);
      if (!image) {
        throw new Error('image not found');
      }

      const imagePalette = getImagePalette(state, image);
      if (!imagePalette) {
        throw new Error('imagePalette not found');
      }

      const tiles = await loadImageTiles(state)(image);
      return prepareFiles(imagePalette, image)(tiles || []);
    }))
      .then((resultImages) => resultImages.flat())
      .then(download(zipFilename));
  };

const startDownload: MiddlewareWithState = (store) => (next) => (action) => {

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
