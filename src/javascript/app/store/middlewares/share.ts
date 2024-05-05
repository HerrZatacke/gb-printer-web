import { getPrepareFiles } from '../../../tools/download';
import loadImageTiles from '../../../tools/loadImageTiles';
import getImagePalette from '../../../tools/getImagePalette';
import { Actions } from '../actions';
import { MiddlewareWithState } from '../../../../types/MiddlewareWithState';

const batch: MiddlewareWithState = (store) => (next) => async (action) => {

  if (action.type === Actions.SHARE_IMAGE) {
    const state = store.getState();

    const image = state.images.find(({ hash }) => hash === action.payload);
    if (!image) {
      throw new Error('image not found');
    }

    const imagePalette = getImagePalette(state, image);
    if (!imagePalette) {
      throw new Error('imagePalette not found');
    }

    const shareScaleFactor = [...state.exportScaleFactors].pop() || 4;
    const shareFileType = [...state.exportFileTypes].pop() || 'png';

    const prepareFiles = getPrepareFiles({
      ...state,
      exportScaleFactors: [shareScaleFactor],
      exportFileTypes: [shareFileType],
    });

    const tiles = await loadImageTiles(state)(image);

    const downloadInfo = await prepareFiles(imagePalette, image)(tiles || []);

    const { blob, filename, title } = downloadInfo[0];

    if (window.navigator.share) {
      window.navigator.share({
        files: [new File([blob], filename, { type: 'image/png', lastModified: Date.now() })],
        title,
      })
        .catch(() => ('¯\\_(ツ)_/¯'));
    }
  }

  next(action);
};

export default batch;
