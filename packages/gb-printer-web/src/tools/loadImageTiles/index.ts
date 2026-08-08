import { type RGBNTiles } from 'gb-image-decoder';
import { getQueryClient } from '@/contexts/QueryClient';
import { framesByIdsQueryOptions } from '@/stores/items/queries/frames';
import { imageByHashQueryOptions } from '@/stores/items/queries/images';
import { isRGBNImage } from '@/tools/isRGBNImage';
import { load } from '@/tools/storage';
import { type Image, type RGBNHashes, type RGBNImage } from '@/types/Image';

export type PImage = {
  hash: Image['hash'];
  frame?: Image['frame'];
  hashes?: RGBNImage['hashes'];
}

export const loadImageTiles = () => {
  const loader = async (
    hash: string,
    noDummy?: boolean,
    overrideFrame?: string,
    hashesOverride?: RGBNHashes,
  ): Promise<string[] | RGBNTiles> => {
    const queryClient = getQueryClient();
    const image = await queryClient.fetchQuery(imageByHashQueryOptions(hash));

    // Image may not exist when loading RGBN-channels where original image has been deleted.
    const frame = (typeof overrideFrame === 'string' ? overrideFrame : image?.frame) || undefined;
    const { items: [foundFrame] } = await queryClient.fetchQuery(framesByIdsQueryOptions(frame ? [frame] : []));
    const frameHash = foundFrame?.hash;

    if (!hashesOverride) {
      if (!image || !isRGBNImage(image)) {
        const tiles = await load(hash, frameHash, noDummy);
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

export const getImageTileCount = () => {
  const tileLoader = loadImageTiles();
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
