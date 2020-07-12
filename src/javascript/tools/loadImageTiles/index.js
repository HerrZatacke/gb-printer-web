import { load } from '../storage';
import getRGBNFrames from '../getRGBNFrames';

const loadImageTiles = ({ hash, frame, hashes }, state) => {
  if (!hashes) {
    return load(hash, frame);
  }

  const frames = getRGBNFrames(state, hashes, frame);

  return Promise.all([
    load(hashes.r, frames.r || frame),
    load(hashes.g, frames.g || frame),
    load(hashes.b, frames.b || frame),
    load(hashes.n, frames.n || frame),
  ]);
};

export default loadImageTiles;
