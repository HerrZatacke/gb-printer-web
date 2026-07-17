import { getItemsSource } from '@/items/client';
import { STALE_TIME } from '@/stores/queries/consts';

const baseKeys = ['items', 'framegroups'] as const;

export const frameGroupsKeys = {
  all: baseKeys,
  list: [...baseKeys, 'list'] as const,
};

export const frameGroupsListQueryOptions = () => {
  return {
    queryKey: frameGroupsKeys.list,
    queryFn: async () => {
      const source = await getItemsSource();
      return source.getFrameGroups();
    },
    staleTime: STALE_TIME,
  };
};
