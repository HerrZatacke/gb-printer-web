import { localforageFrames } from '../localforageInstance';

const hashFrames = async (dirtyStateFrames) => {

  const hasUnhashedFrames = Boolean(dirtyStateFrames.find(({ hash }) => !hash));

  if (!hasUnhashedFrames) {
    return dirtyStateFrames;
  }

  return import(/* webpackChunkName: "obh" */ 'object-hash')
    .then(({ default: hasher }) => (
      Promise.all(dirtyStateFrames.map((frame) => {
        if (frame.hash) {
          return frame;
        }

        return localforageFrames.getItem(frame.id)
          .then((frameData) => {
            const hash = hasher(frameData);
            return localforageFrames.removeItem(frame.id)
              .then(() => (
                localforageFrames.setItem(hash, frameData)
              ))
              .then(() => ({
                ...frame,
                hash,
              }));
          });
      }))
    ));
};

export default hashFrames;
