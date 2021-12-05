import { localforageFrames } from '../localforageInstance';

const getFrames = (exportFrameHashes) => (
  Promise.all(exportFrameHashes.map((hash) => (
    localforageFrames.getItem(hash)
      .then((data) => ({
        hash,
        data,
      }))
  )))
    .then((result) => {
      const resultFrames = {};
      result.forEach(({ hash, data }) => {
        resultFrames[`frame-${hash}`] = data;
      });

      return resultFrames;
    })
);

export default getFrames;
