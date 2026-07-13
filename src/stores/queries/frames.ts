import { getItemsSource } from '@/items/client';
import { createBatchedLoader } from '@/stores/queries/batchedLoader';
import { Frame } from '@/types/Frame';

const baseKeys = ['items', 'frames'] as const;

export const framesKeys = {
  all: baseKeys,
  list: [...baseKeys, 'list'] as const,
  byIds: (ids: string[]) => [...baseKeys, 'byIds', [...ids].sort()] as const,
};

export const framesByIdsBatchedLoader = createBatchedLoader<Frame>(
  async (ids) => {
    const source = await getItemsSource();
    return source.getFramesByIds(ids);
  },
  (frame) => frame.id,
  50,
);

export const framesListQueryOptions = () => {
  return {
    queryKey: framesKeys.list,
    queryFn: async () => {
      const source = await getItemsSource();
      return source.getFrames();
    },
    staleTime: 30000,
  };
};

export const framesByIdsQueryOptions = (ids: string[]) => {
  return {
    queryKey: framesKeys.byIds(ids),
    queryFn: async () => {
      if (!ids?.length) {
        return { items: [], missing: [] };
      }

      const results = await Promise.all(ids.map(framesByIdsBatchedLoader.loadByKey));
      const items = results.filter((f): f is Frame => Boolean(f));
      const missing = ids.filter((id, i) => !Boolean(results[i]));
      return { items, missing };
    },
    staleTime: 30000,
  };
};
