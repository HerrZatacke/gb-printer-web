import { load } from '../storage';
import getRGBNFrames from '../getRGBNFrames';
import RGBNDecoder from '../RGBNDecoder';

const loadImageTiles = (state) => ({ hash, frame, hashes }, noDummy, recover) => {

  const frameHash = state.frames.find(({ id }) => id === frame)?.hash || null;

  if (!hashes) {
    return load(hash, frameHash, noDummy, recover);
  }

  const frames = getRGBNFrames(state, hashes, frameHash);

  return Promise.all([
    load(hashes.r, frames.r || frameHash, noDummy, recover),
    load(hashes.g, frames.g || frameHash, noDummy, recover),
    load(hashes.b, frames.b || frameHash, noDummy, recover),
    load(hashes.n, frames.n || frameHash, noDummy, recover),
  ])
    .then(RGBNDecoder.rgbnTiles);
};

export default loadImageTiles;
