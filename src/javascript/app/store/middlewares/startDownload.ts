import useItemsStore from '../../stores/itemsStore';
import useSettingsStore from '../../stores/settingsStore';
import { getPrepareFiles } from '../../../tools/download';
import download from '../../../tools/download/download';
import generateFileName from '../../../tools/generateFileName';
import { loadImageTiles } from '../../../tools/loadImageTiles';
import { getImagePalettes } from '../../../tools/getImagePalettes';
import { Actions } from '../actions';
import type { Palette } from '../../../../types/Palette';
import type { Frame } from '../../../../types/Frame';
import type { Image } from '../../../../types/Image';
import type { PrepareFilesReturnType } from '../../../tools/download/getPrepareFiles';
import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import { loadFrameData } from '../../../tools/applyFrame/frameData';

interface StateParams {
  images: Image[],
  frames: Frame[],
  palettes: Palette[],
}

const handleSingleImage = (
  prepareFiles: PrepareFilesReturnType,
  stateParams: StateParams,
) => async (imageHash: string): Promise<void> => {
  const image = stateParams.images.find(({ hash }) => hash === imageHash);
  if (!image) {
    throw new Error('image not found');
  }

  const frame = stateParams.frames.find(({ id }) => id === image.frame);

  const { palette: imagePalette } = getImagePalettes(stateParams.palettes, image);
  if (!imagePalette) {
    throw new Error('imagePalette not found');
  }

  const zipFilename = generateFileName({
    image,
    palette: imagePalette,
  });

  const tiles = await loadImageTiles(stateParams.images, stateParams.frames)(image.hash);

  const frameData = frame ? await loadFrameData(frame?.hash) : null;

  const imageStartLine = frameData ? frameData.upper.length / 20 : 2;

  if (!tiles) {
    throw new Error('no tiles');
  }

  const files = await prepareFiles(image)(tiles, imageStartLine);
  return download(zipFilename)(files);
};

const handleImageCollection =
  (prepareFiles: PrepareFilesReturnType, stateParams: StateParams) => async (collection: string[]): Promise<void> => {
    const zipFilename = generateFileName({
      altTitle: 'gameboy-printer-gallery',
      useCurrentDate: true,
    });

    Promise.all(collection.map(async (imageHash) => {
      const image = stateParams.images.find(({ hash }) => hash === imageHash);
      if (!image) {
        throw new Error('image not found');
      }

      const frame = stateParams.frames.find(({ id }) => id === image.frame);

      const tiles = await loadImageTiles(stateParams.images, stateParams.frames)(image.hash);

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
    const { frames, palettes } = useItemsStore.getState();

    const prepareFiles = getPrepareFiles(
      exportScaleFactors,
      exportFileTypes,
      handleExportFrame,
      palettes,
    );

    const stateParams: StateParams = {
      images: state.images,
      frames,
      palettes,
    };

    switch (action.type) {
      case Actions.START_DOWNLOAD:
        handleSingleImage(prepareFiles, stateParams)(action.payload);
        break;

      case Actions.DOWNLOAD_SELECTION:
        handleImageCollection(prepareFiles, stateParams)(action.payload);
        break;

      default:
        break;
    }
  }

  return next(action);
};

export default startDownload;
