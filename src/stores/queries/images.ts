import { getItemsSource } from '@/items/client';
import { createBatchedLoader } from '@/stores/queries/batchedLoader';
import { Image } from '@/types/Image';
import { type GetImagesParams } from '@/workers/itemsIndexedDbWorker/types';

const baseKeys = ['items', 'images'] as const;

export const imagesKeys = {
  all: baseKeys,
  list: [...baseKeys, 'list'] as const,
  byHashes: (hashes: string[]) => [...baseKeys, 'byHashes', [...hashes].sort()] as const,
  raw: (raw: GetImagesParams) => [...baseKeys, 'raw', raw] as const,
};

export const imagesByHashesBatchedLoader = createBatchedLoader<Image>(
  async (hashes) => {
    const source = await getItemsSource();
    return source.getImagesByHashes(hashes);
  },
  (image) => image.hash,
  50,
);

// ToDo: getting _all_ images without pagination must be elimiated for API
export const imagesListQueryOptions = () => {
  return {
    queryKey: imagesKeys.list,
    queryFn: async () => {
      const source = await getItemsSource();
      return source.getImages({
        page: 0,
        pageSize: 10000, // ToDo. Temporary limit. Never do this in the api.
        sort: {
          field: 'created',
          direction: 'asc',
        },
      });
    },
    staleTime: 30000,
  };
};

export const imagesByHashesQueryOptions = (hashes: string[]) => {
  return {
    queryKey: imagesKeys.byHashes(hashes),
    queryFn: async () => {
      if (!hashes?.length) {
        return { items: [], missing: [] };
      }

      const results = await Promise.all(hashes.map(imagesByHashesBatchedLoader.loadByKey));
      const items = results.filter((f): f is Image => Boolean(f));
      const missing = hashes.filter((id, i) => !Boolean(results[i]));
      return { items, missing };
    },
    staleTime: 30000,
  };
};

export const imagesRawQueryOptions = (raw: GetImagesParams) => {
  return {
    queryKey: imagesKeys.raw(raw),
    queryFn: async () => {
      const source = await getItemsSource();
      return source.getImages(raw);
    },
    staleTime: 30000,
  };
};
