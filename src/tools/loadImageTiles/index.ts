import type { RGBNTiles } from 'gb-image-decoder';
import { isRGBNImage } from '@/tools/isRGBNImage';
import { load, type RecoverFn } from '@/tools/storage';
import type { Frame } from '@/types/Frame';
import type { Image, RGBNHashes, RGBNImage } from '@/types/Image';

export type PImage = {
  hash: Image['hash'],
  frame?: Image['frame'],
  hashes?: RGBNImage['hashes'],
}

export const loadImageTiles = (stateImages: Image[], stateFrames: Frame[], recover?: RecoverFn) => {
  const loader = async (
    hash: string,
    noDummy?: boolean,
    overrideFrame?: string,
    hashesOverride?: RGBNHashes,
  ): Promise<string[] | RGBNTiles> => {
    const image = stateImages.find(((img) => hash === img.hash));

    // Image may not exist when loading RGBN-channels where original image has been deleted.
    const frame = (typeof overrideFrame === 'string' ? overrideFrame : image?.frame) || undefined;
    const frameHash = stateFrames.find(({ id }) => id === frame)?.hash;

    if (!hashesOverride) {
      if (!image || !isRGBNImage(image)) {
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

export const getImageTileCount = (stateImages: Image[], stateFrames: Frame[]) => {
  const tileLoader = loadImageTiles(stateImages, stateFrames);
  return async (hash: string): Promise<number> => {
    const loadedTiles = await tileLoader(hash, true, '');
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
