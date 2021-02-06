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

  const missingLocally = [];

  return Promise.all(
    state.images
      .map((image) => (
        loadImageTiles(image, state, true)
          .then((tiles) => {
            if (!tiles.length) {
              missingLocally.push(image.hash);
              return Promise.resolve(null);
            }

            return (
              prepareFiles(getImagePalette(state, image), image)(tiles)
                .then((files) => ({
                  ...image,
                  files,
                }))
            );
          })
      )),
  )
    .then((images) => ({
      imageCollection: images.filter(Boolean),
      missingLocally,
    }));
};

export default getUploadImages;
