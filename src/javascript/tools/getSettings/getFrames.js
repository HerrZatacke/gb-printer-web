import { localforageFrames } from '../localforageInstance';

const getFrames = (storedFrames) => (
  Promise.all(storedFrames.map((frameId) => (
    localforageFrames.getItem(frameId).then((data) => ({
      frameId,
      data,
    }))
  )))
    .then((result) => {
      const frames = {};
      result.forEach(({ frameId, data }) => {
        frames[`frame-${frameId}`] = data;
      });

      return frames;
    })
);

export default getFrames;
