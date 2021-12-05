import { localforageFrames } from '../localforageInstance';

const getFrames = (frames) => {
  const frameHashes = frames.map(({ hash }) => hash);

  return (
    Promise.all(frameHashes.map((frameHash) => (
      localforageFrames.getItem(frameHash)
        .then((data) => ({
          frameHash,
          data,
        }))
    )))
      .then((result) => {
        const resultFrames = {};
        result.forEach(({ frameHash, data }) => {
          resultFrames[`frame-${frameHash}`] = data;
        });

        return resultFrames;
      })
  );
};

export default getFrames;
