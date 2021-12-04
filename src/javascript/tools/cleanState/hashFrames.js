import { localforageFrames } from '../localforageInstance';

const hashFrames = async (dirtyStateFrames) => {

  const hasUnhashedFrames = dirtyStateFrames.find(({ hash }) => !hash);

  if (hasUnhashedFrames) {
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
  }

  return dirtyStateFrames;
};

export default hashFrames;
