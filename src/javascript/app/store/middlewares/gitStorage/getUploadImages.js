import getPrepareFiles from '../../../../tools/download/getPrepareFiles';
import loadImageTiles from '../../../../tools/loadImageTiles';
import getImagePalette from '../../../../tools/getImagePalette';

const getUploadImages = (state) => {
  // const { exportScaleFactors, exportFileTypes, exportCropFrame } = state;
  const prepareFiles = getPrepareFiles({
    ...state,
    exportScaleFactors: [1],
    exportFileTypes: ['png', 'txt'],
    exportCropFrame: false,
  });

  return Promise.all(
    state.images
      .map((image) => (
        loadImageTiles(image, state)
          .then((tiles) => (
            prepareFiles(getImagePalette(state, image), image)(tiles)
              .then((files) => ({
                ...image,
                files,
              }))
          ))
      )),
  );
};

export default getUploadImages;
