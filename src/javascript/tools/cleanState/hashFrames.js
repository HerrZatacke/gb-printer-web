import { localforageFrames } from '../localforageInstance';

const hashFrames = async (dirtyStateFrames) => {

  const hasUnhashedFrames = dirtyStateFrames.find(({ hash }) => !hash);

  if (hasUnhashedFrames) {
    return import(/* webpackChunkName: "obh" */ 'object-hash')
      .then(({ default: hash }) => (
        Promise.all(dirtyStateFrames.map((frame) => {
          if (frame.hash) {
            return frame;
          }

          return localforageFrames.getItem(frame.id)
            .then((frameData) => ({
              ...frame,
              hash: hash(frameData),
            }));
        }))
      ));
  }

  return dirtyStateFrames;
};

export default hashFrames;
