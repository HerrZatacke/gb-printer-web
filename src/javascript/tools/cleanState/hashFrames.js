import { localforageFrames } from '../localforageInstance';
import backupFrames from './backupFrames';

const hashFrames = async (dirtyStateFrames) => {

  const hasUnhashedFrames = Boolean(dirtyStateFrames.find(({ hash }) => !hash));

  console.log({ hasUnhashedFrames });

  if (!hasUnhashedFrames) {
    return null;
  }

  await backupFrames(dirtyStateFrames);

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
