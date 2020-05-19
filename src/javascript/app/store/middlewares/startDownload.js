import { load } from '../../../tools/storage';
import { prepareFiles, prepareFilesRGBN } from '../../../tools/download';

const startDownload = (store) => (next) => (action) => {

  if (action.type === 'START_DOWNLOAD') {
    const state = store.getState();
    const exportScaleFactors = state.exportScaleFactors;

    if (exportScaleFactors.length === 0) {
      return null;
    }

    const image = state.images.find(({ hash }) => hash === action.payload);
    const palette = state.palettes.find(({ shortName }) => shortName === image.palette);
    load(action.payload)
      .then(prepareFiles(palette, exportScaleFactors, image));

  } else if (action.type === 'START_DOWNLOAD_RGBN') {
    const state = store.getState();
    const exportScaleFactors = state.exportScaleFactors;

    if (exportScaleFactors.length === 0) {
      return null;
    }


    Promise.all([
      load(state.rgbnImages.r),
      load(state.rgbnImages.g),
      load(state.rgbnImages.b),
      load(state.rgbnImages.n),
    ])
      .then(prepareFilesRGBN(exportScaleFactors));

  }

  return next(action);
};

export default startDownload;
