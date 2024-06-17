import type { RGBNTiles } from 'gb-image-decoder';
import { load } from '../storage';
import { isRGBNImage } from '../isRGBNImage';
import type { RecoverFn } from '../storage';
import type { State } from '../../app/store/State';
import type { Image, RGBNHashes, RGBNImage } from '../../../types/Image';

export type PImage = {
  hash: Image['hash'],
  frame?: Image['frame'],
  hashes?: RGBNImage['hashes'],
}

export type ReducedPickState = Pick<State, 'frames' | 'images'>

export const loadImageTiles = (state: State | ReducedPickState, recover?: RecoverFn) => {
  const loader = async (
    hash: string,
    noDummy?: boolean,
    overrideFrame?: string,
    hashesOverride?: RGBNHashes,
  ): Promise<string[] | RGBNTiles> => {
    const image = state.images.find(((img) => hash === img.hash));
    let frame: string | undefined;

    if (!hashesOverride) {
      if (!image) {
        return [];
      }

      frame = typeof overrideFrame === 'string' ? overrideFrame : image.frame || undefined;
      const frameHash = state.frames.find(({ id }) => id === frame)?.hash;

      if (!isRGBNImage(image as Image)) {
        const tiles = await load(hash, frameHash, noDummy, recover);
        return tiles || [];
      }
    }

    const hashes = hashesOverride || (image as RGBNImage).hashes;

    const r = hashes.r ? await loader(hashes.r, noDummy, frame) as string[] : [];
    const g = hashes.g ? await loader(hashes.g, noDummy, frame) as string[] : [];
    const b = hashes.b ? await loader(hashes.b, noDummy, frame) as string[] : [];
    const n = hashes.n ? await loader(hashes.n, noDummy, frame) as string[] : [];

    return { r, g, b, n };
  };

  return loader;
};

export const getImageTileCount = (state: State) => {
  const tileLoader = loadImageTiles(state);
  return async (hash: string): Promise<number> => {
    const loadedTiles = await tileLoader(hash);
    if (loadedTiles) {
      return (
        (loadedTiles as string[])?.length ||
        (loadedTiles as RGBNTiles).r?.length ||
        (loadedTiles as RGBNTiles).g?.length ||
        (loadedTiles as RGBNTiles).b?.length ||
        (loadedTiles as RGBNTiles).n?.length || 0
      );
    }

    return 0;
  };
};
