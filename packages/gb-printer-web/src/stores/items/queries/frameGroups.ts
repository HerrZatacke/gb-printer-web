import { QueryClient } from '@tanstack/react-query';
import { FrameGroup } from 'gb-printer-schemas';
import { getItemsSource } from '@/stores/items/client';
import { frameGroupsKeys } from '@/stores/items/queries/cacheKeys';
import { STALE_TIME } from '@/stores/items/queries/consts';

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

export const updateFrameGroupsAction = async (queryClient: QueryClient, frameGroups: FrameGroup[], purge = false): Promise<void> => {
  const source = await getItemsSource();
  await source.updateFrameGroups({ frameGroups, purge });
};

export const deleteFrameGroupsByIdsAction = async (queryClient: QueryClient, deleteIds: string[]): Promise<void> => {
  const source = await getItemsSource();
  await source.deleteFrameGroupsByIds({ ids: deleteIds });
};
