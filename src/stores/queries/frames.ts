import { QueryClient } from '@tanstack/react-query';
import { getItemsSource } from '@/items/client';
import { createBatchedLoader } from '@/stores/queries/batchedLoader';
import { STALE_TIME } from '@/stores/queries/consts';
import { Frame } from '@/types/Frame';

const baseKeys = ['items', 'frames'] as const;

export const framesKeys = {
  all: baseKeys,
  list: [...baseKeys, 'list'] as const,
  byIds: (ids: string[]) => [...baseKeys, 'byIds', [...ids].sort()] as const,
  byHashes: (hashes: string[]) => [...baseKeys, 'byHashes', [...hashes].sort()] as const,
};

export const framesListQueryOptions = () => {
  return {
    queryKey: framesKeys.list,
    queryFn: async () => {
      const source = await getItemsSource();
      return source.getFrames();
    },
    staleTime: STALE_TIME,
  };
};

export const framesByHashesBatchedLoader = createBatchedLoader<Frame>(
  async (hashes) => {
    const source = await getItemsSource();
    return source.getFramesByHashes(hashes);
  },
  (frame) => frame.hash,
  50,
);

export const framesByIdsBatchedLoader = createBatchedLoader<Frame>(
  async (ids) => {
    const source = await getItemsSource();
    return source.getFramesByIds(ids);
  },
  (frame) => frame.id,
  50,
);

export const framesByHashesQueryOptions = (hashes: string[]) => {
  return {
    queryKey: framesKeys.byHashes(hashes),
    queryFn: async () => {
      if (!hashes?.length) {
        return { items: [] };
      }

      const results = await Promise.all(hashes.map(framesByHashesBatchedLoader.loadByKey));
      const items = results.filter((f): f is Frame => Boolean(f));
      return { items };
    },
    staleTime: STALE_TIME,
  };
};

export const framesByIdsQueryOptions = (ids: string[]) => {
  return {
    queryKey: framesKeys.byIds(ids),
    queryFn: async () => {
      if (!ids?.length) {
        return { items: [] };
      }

      const results = await Promise.all(ids.map(framesByIdsBatchedLoader.loadByKey));
      const items = results.filter((f): f is Frame => Boolean(f));
      return { items };
    },
    staleTime: STALE_TIME,
  };
};

export const updateFramesAction = async (queryClient: QueryClient, frames: Frame[], purge = false): Promise<void> => {
  const source = await getItemsSource();
  await source.updateFrames(frames, purge);
  await queryClient.invalidateQueries({ queryKey: framesKeys.all });
};

export const deleteFramesByIdsAction = async (queryClient: QueryClient, deleteIds: string[]): Promise<void> => {
  const source = await getItemsSource();
  await source.deleteFramesByIds(deleteIds);
  await queryClient.invalidateQueries({ queryKey: framesKeys.all });
};
