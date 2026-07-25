import { type QueryClient } from '@tanstack/react-query';
import { getQueryClient } from '@/contexts/QueryClient';
import { getItemsSource } from '@/items/client';
import { createBatchedLoader } from '@/stores/queries/batchedLoader';
import { STALE_TIME } from '@/stores/queries/consts';
import { BinaryStoreItem } from '@/types/BinaryStoreItem';

const baseKeys = ['items', 'binary', 'images'] as const;

export const binaryImagesKeys = {
  all: baseKeys,
  allHashes: [...baseKeys, 'allHashes'] as const,
  byHash: (hash: string) => [...baseKeys, 'byHash', hash] as const,
  byHashes: (hashes: string[]) => [...baseKeys, 'byHashes', [...hashes].sort()] as const,
};

const warmBinaryImageCache = (binaryImages: BinaryStoreItem[]) => {
  const queryClient = getQueryClient();
  binaryImages.forEach((binaryImage) => {
    queryClient.setQueryData(binaryImagesKeys.byHash(binaryImage.hash), binaryImage);
  });
};

export const binaryImagesByHashesBatchedLoader = createBatchedLoader<BinaryStoreItem>(
  async (hashes) => {
    const source = await getItemsSource();
    return source.getBinaryImagesByHashes(hashes);
  },
  (image) => image.hash,
  50,
);

export const binaryImageHashesQueryOptions = () => ({
  queryKey: binaryImagesKeys.allHashes,
  queryFn: async () => {
    const source = await getItemsSource();
    return source.getBinaryImageHashes();
  },
  staleTime: STALE_TIME,
});

export const binaryImageByHashQueryOptions = (hash: string) => ({
  queryKey: binaryImagesKeys.byHash(hash), // mostly populated by binaryImageHashesQueryOptions
  queryFn: async () => binaryImagesByHashesBatchedLoader.loadByKey(hash),
  staleTime: STALE_TIME,
});

export const binaryImagesByHashesQueryOptions = (hashes: string[]) => {
  return {
    queryKey: binaryImagesKeys.byHashes(hashes),
    queryFn: async () => {
      if (!hashes?.length) {
        return { items: [] };
      }

      const results = await Promise.all(hashes.map(binaryImagesByHashesBatchedLoader.loadByKey));
      const items = results.filter((f): f is BinaryStoreItem => Boolean(f));

      warmBinaryImageCache(items);
      return { items };
    },
    select: (data: { items: BinaryStoreItem[] }) => {
      const byHash = new Map(data.items.map((image) => [image.hash, image]));
      return {
        items: hashes // sort result by this call's original order, not the cached one
          .map((hash) => byHash.get(hash))
          .filter((image): image is BinaryStoreItem => Boolean(image)),
      };
    },
    staleTime: STALE_TIME,
  };
};

export const updateBinaryImagesAction = async (queryClient: QueryClient, binaryImages: BinaryStoreItem[]): Promise<void> => {
  const source = await getItemsSource();
  await source.updateBinaryImages(binaryImages);
  await queryClient.invalidateQueries({ queryKey: binaryImagesKeys.all });
};

export const deleteBinaryImagesByHashesAction = async (queryClient: QueryClient, hashes: string[]): Promise<void> => {
  const source = await getItemsSource();
  await source.deleteBinaryImagesByHashes(hashes);
  await queryClient.invalidateQueries({ queryKey: binaryImagesKeys.all });
};
