import { getItemsSource } from '@/items/client';

const baseKeys = ['items', 'frames'] as const;

export const framesKeys = {
  all: baseKeys,
  list: [...baseKeys, 'list'] as const,
  byIds: (ids: string[]) => [...baseKeys, 'byIds', [...ids]] as const,
};

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
      const source = await getItemsSource();
      return source.getFramesByIds(ids || []);
    },
    staleTime: 30000,
  };
};
