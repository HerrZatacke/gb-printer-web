import { load } from '../storage';
import getRGBNFrames from '../getRGBNFrames';

const loadImageTiles = (state) => ({ hash, frame, hashes }, noDummy) => {
  if (!hashes) {
    return load(hash, frame, noDummy);
  }

  const frames = getRGBNFrames(state, hashes, frame);

  return Promise.all([
    load(hashes.r, frames.r || frame, noDummy),
    load(hashes.g, frames.g || frame, noDummy),
    load(hashes.b, frames.b || frame, noDummy),
    load(hashes.n, frames.n || frame, noDummy),
  ]);
};

export default loadImageTiles;
