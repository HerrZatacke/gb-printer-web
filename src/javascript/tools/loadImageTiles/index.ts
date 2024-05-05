import { load, RecoverFn } from '../storage';
import getRGBNFrames from '../getRGBNFrames';
import RGBNDecoder from '../RGBNDecoder';
import { State } from '../../app/store/State';
import { Image, RGBNImage } from '../../../types/Image';
import { isRGBNImage } from '../isRGBNImage';
import { RGBNTile } from '../Decoder/types';

const loadImageTiles = (state: State) => async (
  image: Image,
  noDummy?: boolean,
  recover?: RecoverFn,
): Promise<string[] | RGBNTile[] | void> => {
  const { hash, frame } = image;
  const frameHash = state.frames.find(({ id }) => id === frame)?.hash || null;

  if (!isRGBNImage(image)) {
    const tiles = await load(hash, frameHash, noDummy, recover);
    return tiles || [];
  }

  const { hashes } = image as RGBNImage;
  const frames = getRGBNFrames(state, hashes, frameHash);

  const tiles: [string[], string[], string[], string[]] = [
    (hashes.r && await load(hashes.r, frames.r || frameHash, noDummy, recover)) || [],
    (hashes.g && await load(hashes.g, frames.g || frameHash, noDummy, recover)) || [],
    (hashes.b && await load(hashes.b, frames.b || frameHash, noDummy, recover)) || [],
    (hashes.n && await load(hashes.n, frames.n || frameHash, noDummy, recover)) || [],
  ];

  return RGBNDecoder.rgbnTiles(tiles);
};

export default loadImageTiles;
