import { getPrepareFiles } from '../../../tools/download';
import loadImageTiles from '../../../tools/loadImageTiles';
import getImagePalette from '../../../tools/getImagePalette';

const batch = (store) => (next) => (action) => {

  if (action.type === 'SHARE_IMAGE') {
    const state = store.getState();

    const image = state.images.find(({ hash }) => hash === action.payload);
    const imagePalette = getImagePalette(state, image);

    const shareScaleFactor = [...state.exportScaleFactors].pop() || 4;
    const shareFileType = [...state.exportFileTypes].pop() || 'png';

    const prepareFiles = getPrepareFiles({
      ...state,
      exportScaleFactors: [shareScaleFactor],
      exportFileTypes: [shareFileType],
    });

    loadImageTiles(state)(image)
      .then(prepareFiles(imagePalette, image))
      .then((res) => {
        const { blob, filename, title } = res[0];

        if (window.navigator.share) {
          window.navigator.share({
            files: [new File([blob], filename, { type: 'image/png', lastModified: new Date() })],
            title,
          })
            .catch(() => ('¯\\_(ツ)_/¯'));
        }
      });
  }

  next(action);
};

export default batch;
