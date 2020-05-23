import { load } from '../../../tools/storage';
import { prepareFiles } from '../../../tools/download';

const startDownload = (store) => (next) => (action) => {

  if (action.type === 'START_DOWNLOAD') {
    const state = store.getState();
    const image = state.images.find(({ hash }) => hash === action.payload);
    const exportScaleFactors = state.exportScaleFactors;

    if (exportScaleFactors.length === 0) {
      return null;
    }

    if (!image.hashes) {
      // default type image
      const palette = state.palettes.find(({ shortName }) => shortName === image.palette);
      load(action.payload)
        .then(prepareFiles(palette, exportScaleFactors, image));

    } else {
      const palette = image.rgbnPalette;

      // rgbn image
      Promise.all([
        load(image.hashes.r),
        load(image.hashes.g),
        load(image.hashes.b),
        load(image.hashes.n),
      ])
        .then(prepareFiles(palette, exportScaleFactors, image));

    }
  }

  return next(action);
};

export default startDownload;
