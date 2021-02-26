import { localforageFrames } from '../localforageInstance';

const getFrames = (frames) => {
  const frameIDs = frames.map(({ id }) => id);

  return (
    Promise.all(frameIDs.map((frameId) => (
      localforageFrames.getItem(frameId)
        .then((data) => ({
          frameId,
          data,
        }))
    )))
      .then((result) => {
        const resultFrames = {};
        result.forEach(({ frameId, data }) => {
          resultFrames[`frame-${frameId}`] = data;
        });

        return resultFrames;
      })
  );
};

export default getFrames;
