import { localforageFrames } from '../localforageInstance';
import { Frame } from '../../../types/Frame';

const hashFrames = async (dirtyStateFrames: Frame[]): Promise<Frame[]> => {
  const hasUnhashedFrames = Boolean(dirtyStateFrames.find(({ hash }) => !hash));

  if (!hasUnhashedFrames) {
    return dirtyStateFrames;
  }

  const { default: hasher } = await import(/* webpackChunkName: "obh" */ 'object-hash');

  return Promise.all(dirtyStateFrames.map(async (frame: Frame): Promise<Frame> => {
    if (frame.hash) {
      return frame;
    }

    const frameData = await localforageFrames.getItem(frame.id);

    if (!frameData) {
      console.warn('could not load frame data for hashing');
      return frame;
    }

    const hash = hasher(frameData);
    await localforageFrames.removeItem(frame.id);
    await localforageFrames.setItem(hash, frameData);

    return {
      ...frame,
      hash,
    } as Frame;
  }));
};

export default hashFrames;
