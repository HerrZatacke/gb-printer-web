import { type QueryClient } from '@tanstack/react-query';
import { getQueryClient } from '@/contexts/QueryClient';
import { getItemsSource } from '@/stores/items/client';
import { createBatchedLoader } from '@/stores/items/queries/batchedLoader';
import { imagesKeys } from '@/stores/items/queries/cacheKeys';
import { resetImageCaches } from '@/stores/items/queries/cacheResets';
import { STALE_TIME } from '@/stores/items/queries/consts';
import { Image } from '@/types/Image';
import {
  type ImageQueryFilters,
  type ImageQueryParams,
  type ImageQuerySort,
  type ItemsReferenceList,
  type ItemsSourceTotalResponse,
} from '@/workers/itemsIndexedDbWorker/types';

const warmImageCache = (images: Image[]) => {
  const queryClient = getQueryClient();
  images.forEach((image) => {
    queryClient.setQueryData(imagesKeys.byHash(image.hash), image);
  });
};

export const imagesByHashesBatchedLoader = createBatchedLoader<Image>(
  async (hashes): Promise<ItemsSourceTotalResponse<Image>> => {
    const source = await getItemsSource();
    const response = await source.getImagesByHashes(hashes);
    return {
      duration: response.duration,
      total: response.paging.total,
      items: response.items,
    };
  },
  (image) => image.hash,
  50,
);

export const imagesByAnyHashesBatchedLoader = createBatchedLoader<ItemsReferenceList<Image>>(
  async (hashes): Promise<ItemsSourceTotalResponse<ItemsReferenceList<Image>>> => {
    const source = await getItemsSource();
    const response = await source.getImagesByAnyHashes(hashes);
    return {
      duration: response.duration,
      total: response.paging.total,
      items: response.items,
    };
  },
  (image) => image.reference,
  50,
);

export const imagesListQueryOptions = () => {
  return {
    queryKey: imagesKeys.list,
    queryFn: async () => {
      const source = await getItemsSource();

      const { totals: { images: totalImages } } = await source.getStats();

      if (totalImages > 5000) {
        console.warn(`Querying ${totalImages} images. When using remote APIs this might fail`);
      }

      const result = await source.getImages({
        page: 0,
        pageSize: totalImages,
        sort: {
          field: 'created',
          direction: 'asc',
        },
      });

      warmImageCache(result.items);
      return result;
    },
    staleTime: STALE_TIME,
  };
};

export const groupItemsByGroupIdQueryOptions = (groupId: string, includeGroups: boolean, params: ImageQueryParams) => {
  return {
    queryKey: imagesKeys.byGroupId(groupId, includeGroups, params),
    queryFn: async () => {
      const source = await getItemsSource();
      const result = await source.getGroupItemsByGroupId(groupId, includeGroups, params);
      return result;
    },
    staleTime: STALE_TIME,
  };
};

export const hashesByGroupIdQueryOptions = (
  groupId: string,
  includeGroupImageHashes: boolean,
  sort: ImageQuerySort,
  filters?: ImageQueryFilters,
) => {
  return {
    queryKey: imagesKeys.hashesByGroupId(groupId, includeGroupImageHashes, sort, filters),
    queryFn: async () => {
      const source = await getItemsSource();
      const result = await source.getHashesByGroupId(groupId, includeGroupImageHashes, sort, filters);
      return result;
    },
    staleTime: STALE_TIME,
  };
};

export const imagesAllTagsQueryOptions = () => {
  return {
    queryKey: imagesKeys.allTags,
    queryFn: async () => {
      const source = await getItemsSource();
      return source.getAllTags();
    },
    staleTime: STALE_TIME,
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
    staleTime: STALE_TIME,
  };
};

export const imageByHashQueryOptions = (hash: string) => ({
  queryKey: imagesKeys.byHash(hash), // mostly populated by imagesByHashes
  queryFn: async () => imagesByHashesBatchedLoader.loadByKey(hash),
  staleTime: STALE_TIME,
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
    staleTime: STALE_TIME,
  };
};

export const imagesRawQueryOptions = (raw: ImageQueryParams, candidateHashes?: Set<string>) => {
  return {
    queryKey: imagesKeys.raw(raw, candidateHashes),
    queryFn: async () => {
      const source = await getItemsSource();
      const result = await source.getImages(raw, candidateHashes);

      warmImageCache(result.items);
      return result;
    },
    staleTime: STALE_TIME,
  };
};

export const updateImagesAction = async (queryClient: QueryClient, images: Image[], purge = false): Promise<void> => {
  const source = await getItemsSource();
  // ToDo: updateImages should report if groups were also affected (e.g. by adding new images)
  await source.updateImages(images, purge);
  await resetImageCaches(queryClient, true);
};

export const deleteImagesByHashesAction = async (queryClient: QueryClient, hashes: string[]): Promise<void> => {
  const source = await getItemsSource();
  await source.deleteImagesByHashes(hashes);
  await resetImageCaches(queryClient, true);
};
