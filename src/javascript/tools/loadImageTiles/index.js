import { load } from '../storage';
import getRGBNFrames from '../getRGBNFrames';
import RGBNDecoder from '../RGBNDecoder';

const loadImageTiles = (state) => ({ hash, frame, hashes }, noDummy, recover) => {
  if (!hashes) {
    return load(hash, frame, noDummy, recover);
  }

  const frames = getRGBNFrames(state, hashes, frame);

  return Promise.all([
    load(hashes.r, frames.r || frame, noDummy, recover),
    load(hashes.g, frames.g || frame, noDummy, recover),
    load(hashes.b, frames.b || frame, noDummy, recover),
    load(hashes.n, frames.n || frame, noDummy, recover),
  ])
    .then(RGBNDecoder.rgbnTiles);
};

export default loadImageTiles;
