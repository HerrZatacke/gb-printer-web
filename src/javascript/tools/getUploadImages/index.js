import getPrepareFiles from '../download/getPrepareFiles';
import loadImageTiles from '../loadImageTiles';
import getImagePalette from '../getImagePalette';
import { loadFrameData } from '../applyFrame/frameData';
import filterDeleteNew from '../filterDeleteNew';
import getPrepareRemoteFiles from '../getPrepareRemoteFiles';

const getUploadImages = (store, repoContents, addToQueue) => {
  const state = store.getState();
  const exportFileTypes = ['txt'];
  const exportScaleFactors = [1];
  const prepareFiles = getPrepareFiles({
    ...state,
    exportScaleFactors,
    exportFileTypes,
    handleExportFrame: 'keep',
  });
  const prepareGitFiles = getPrepareRemoteFiles(store);
  const missingLocally = [];

  const images = state.images
    .filter(({ hashes }) => !hashes)
    .map((image) => ({
      ...image,
      inRepo: [
        repoContents.images.find(({ name }) => name.substr(0, 40) === image.hash),
      ].filter(Boolean),
    }));
  const imagesLength = images.length;

  const frames = state.frames.map((frame) => ({
    ...frame,
    inRepo: [
      repoContents.frames.find(({ name }) => name.match(/^[a-z]+[0-9]+/gi)[0] === frame.id),
    ].filter(Boolean),
  }));
  const framesLength = frames.length;

  return Promise.all([
    ...images
      .map((image, index) => (
        image.inRepo.length ? ({
          ...image,
          inRepo: image.inRepo,
          files: [],
        }) : (
          addToQueue(`loadImageTiles (${index + 1}/${imagesLength}) ${image.title}`, 3, () => (
            loadImageTiles(state)(image, true)
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
        )
      )),
    ...frames
      .map((frame, index) => (
        frame.inRepo.length ? ({
          ...frame,
          inRepo: frame.inRepo,
          files: [],
        }) : (
          addToQueue(`loadFrameData (${index + 1}/${framesLength}) ${frame.id}`, 3, () => (
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
        )
      )),
  ])
    .then((files) => (
      prepareGitFiles(files.filter(Boolean))
    ))
    .then(({ toUpload, toKeep }) => (
      filterDeleteNew(repoContents, toUpload, toKeep, missingLocally)
    ));
};

export default getUploadImages;
