import { localforageFrames } from '../localforageInstance';

const hashFrames = async (dirtyStateFrames) => {

  const hasUnhashedFrames = Boolean(dirtyStateFrames.find(({ hash }) => hash?.length !== 64));

  if (!hasUnhashedFrames) {
    return dirtyStateFrames;
  }

  const { default: hasher } = await import(/* webpackChunkName: "obh" */ 'object-hash');
  const { default: pako } = await import(/* webpackChunkName: "pko" */ 'pako');

  return Promise.all(dirtyStateFrames.map((frame) => {
    if (frame.hash?.length === 64) {
      return frame;
    }

    if (!frame) {
      return null;
    }

    return localforageFrames.getItem(frame.id)
      .then((frameData) => {

        if (!frameData) {
          return null;
        }

        const tiles = pako.inflate(frameData, { to: 'string' });
        console.log(frame.id, tiles);

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
  }));
};

export default hashFrames;
