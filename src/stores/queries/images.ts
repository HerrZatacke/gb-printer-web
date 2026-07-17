import { getQueryClient } from '@/contexts/QueryClient';
import { getItemsSource } from '@/items/client';
import { createBatchedLoader } from '@/stores/queries/batchedLoader';
import { Image } from '@/types/Image';
import { type GetImagesParams, type ItemsReferenceList } from '@/workers/itemsIndexedDbWorker/types';

const baseKeys = ['items', 'images'] as const;

export const imagesKeys = {
  all: baseKeys,
  list: [...baseKeys, 'list'] as const,
  allTags: [...baseKeys, 'allTags'] as const,
  byHash: (hash: string) => [...baseKeys, 'byHash', hash] as const,
  byHashes: (hashes: string[]) => [...baseKeys, 'byHashes', [...hashes].sort()] as const,
  byAnyHashes: (hashes: string[]) => [...baseKeys, 'byAnyHashes', [...hashes].sort()] as const,
  raw: (raw: GetImagesParams) => [...baseKeys, 'raw', raw] as const,
};

const warmImageCache = (images: Image[]) => {
  const queryClient = getQueryClient();
  images.forEach((image) => {
    queryClient.setQueryData(imagesKeys.byHash(image.hash), image);
  });
};

export const imagesByHashesBatchedLoader = createBatchedLoader<Image>(
  async (hashes) => {
    const source = await getItemsSource();
    return source.getImagesByHashes(hashes);
  },
  (image) => image.hash,
  50,
);

export const imagesByAnyHashesBatchedLoader = createBatchedLoader<ItemsReferenceList<Image>>(
  async (hashes) => {
    const source = await getItemsSource();
    return source.getImagesByAnyHashes(hashes);
  },
  (image) => image.reference,
  50,
);

// ToDo: getting _all_ images without pagination must be elimiated for API
export const imagesListQueryOptions = () => {
  return {
    queryKey: imagesKeys.list,
    queryFn: async () => {
      const source = await getItemsSource();
      const result = await source.getImages({
        page: 0,
        pageSize: 10000, // ToDo. Temporary limit. Never do this in the api.
        sort: {
          field: 'created',
          direction: 'asc',
        },
      });

      warmImageCache(result.items);
      return result;
    },
    staleTime: 30000,
  };
};

export const imagesAllTagsQueryOptions = () => {
  return {
    queryKey: imagesKeys.allTags,
    queryFn: async () => {
      const source = await getItemsSource();
      return source.getAllTags();
    },
    staleTime: 30000,
  };
};

export const imagesByHashesQueryOptions = (hashes: string[]) => {
  return {
    queryKey: imagesKeys.byHashes(hashes),
    queryFn: async () => {
      if (!hashes?.length) {
        return { items: [] };
      }

      const results = await Promise.all(hashes.map(imagesByHashesBatchedLoader.loadByKey));
      const items = results.filter((f): f is Image => Boolean(f));

      warmImageCache(items);
      return { items };
    },
    select: (data: { items: Image[] }) => {
      const byHash = new Map(data.items.map((image) => [image.hash, image]));
      return {
        items: hashes // sort result by this call's original order, not the cached one
          .map((hash) => byHash.get(hash))
          .filter((image): image is Image => Boolean(image)),
      };
    },
    staleTime: 30000,
  };
};

export const imageByHashQueryOptions = (hash: string) => ({
  queryKey: imagesKeys.byHash(hash), // mostly populated by imagesByHashes
  queryFn: async () => imagesByHashesBatchedLoader.loadByKey(hash),
  staleTime: 30000,
});

export const imagesByAnyHashesQueryOptions = (hashes: string[]) => {
  return {
    queryKey: imagesKeys.byAnyHashes(hashes),
    queryFn: async () => {
      if (!hashes?.length) {
        return { items: [] };
      }

      const results = await Promise.all(hashes.map(imagesByAnyHashesBatchedLoader.loadByKey));
      const items = results.filter((f): f is ItemsReferenceList<Image> => Boolean(f));
      return { items };
    },
    staleTime: 30000,
  };
};

export const imagesRawQueryOptions = (raw: GetImagesParams) => {
  return {
    queryKey: imagesKeys.raw(raw),
    queryFn: async () => {
      const source = await getItemsSource();
      const result = await source.getImages(raw);

      warmImageCache(result.items);
      return result;
    },
    staleTime: 30000,
  };
};
