import getPrepareFiles from '../../../../tools/download/getPrepareFiles';
import loadImageTiles from '../../../../tools/loadImageTiles';
import getImagePalette from '../../../../tools/getImagePalette';
import { loadFrameData } from '../../../../tools/applyFrame/frameData';

const getUploadImages = (state, addToQueue) => {
  // const { exportScaleFactors, exportFileTypes, exportCropFrame } = state;
  const prepareFiles = getPrepareFiles({
    ...state,
    exportScaleFactors: [1],
    exportFileTypes: ['png', 'txt'],
    exportCropFrame: false,
  });

  const missingLocally = [];

  const imagesLength = state.images.length;
  const framesLength = state.frames.length;

  return Promise.all([
    ...state.images
      .map((image, index) => (
        addToQueue(`loadImageTiles (${index + 1}/${imagesLength}) ${image.title}`, () => (
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
        ))
      )),
    ...state.frames
      .map((frame, index) => (
        addToQueue(`loadFrameData (${index + 1}/${framesLength}) ${frame.id}`, () => (
          loadFrameData(frame.id)
            .then((fd) => ({
              ...frame,
              hash: frame.id,
              files: [{
                folder: 'frames',
                filename: '',
                blob: new Blob(new Array(JSON.stringify(fd || '{}', null, 2)), { type: 'application/json' }),
                title: frame.name,
              }],
            }))
        ))
      )),
  ])
    .then((files) => ({
      imageCollection: files.filter(Boolean),
      missingLocally,
    }));
};

export default getUploadImages;
