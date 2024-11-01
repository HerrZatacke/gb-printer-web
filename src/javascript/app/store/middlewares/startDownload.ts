import useSettingsStore from '../../stores/settingsStore';
import { getPrepareFiles } from '../../../tools/download';
import download from '../../../tools/download/download';
import generateFileName from '../../../tools/generateFileName';
import { loadImageTiles } from '../../../tools/loadImageTiles';
import { getImagePalettes } from '../../../tools/getImagePalettes';
import { Actions } from '../actions';
import type { State } from '../State';
import type { PrepareFilesReturnType } from '../../../tools/download/getPrepareFiles';
import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import { loadFrameData } from '../../../tools/applyFrame/frameData';

const handleSingleImage = (
  prepareFiles: PrepareFilesReturnType,
  state: State,
) => async (imageHash: string): Promise<void> => {
  const image = state.images.find(({ hash }) => hash === imageHash);
  if (!image) {
    throw new Error('image not found');
  }

  const frame = state.frames.find(({ id }) => id === image.frame);

  const { palette: imagePalette } = getImagePalettes(state, image);
  if (!imagePalette) {
    throw new Error('imagePalette not found');
  }

  const zipFilename = generateFileName({
    image,
    palette: imagePalette,
  });

  const tiles = await loadImageTiles(state)(image.hash);

  const frameData = frame ? await loadFrameData(frame?.hash) : null;

  const imageStartLine = frameData ? frameData.upper.length / 20 : 2;

  if (!tiles) {
    throw new Error('no tiles');
  }

  const files = await prepareFiles(image)(tiles, imageStartLine);
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

      const frame = state.frames.find(({ id }) => id === image.frame);

      const tiles = await loadImageTiles(state)(image.hash);

      const frameData = frame ? await loadFrameData(frame?.hash) : null;

      const imageStartLine = frameData ? frameData.upper.length / 20 : 2;

      return prepareFiles(image)(tiles || [], imageStartLine);
    }))
      .then((resultImages) => resultImages.flat())
      .then(download(zipFilename));
  };

const startDownload: MiddlewareWithState = (store) => (next) => (action) => {
  const { exportScaleFactors, exportFileTypes, handleExportFrame } = useSettingsStore.getState();

  if ((action.type === Actions.START_DOWNLOAD) || (action.type === Actions.DOWNLOAD_SELECTION)) {
    const state = store.getState();

    const prepareFiles = getPrepareFiles(
      exportScaleFactors,
      exportFileTypes,
      handleExportFrame,
      state,
    );

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
