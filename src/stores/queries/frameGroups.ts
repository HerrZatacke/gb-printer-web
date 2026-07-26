import { QueryClient } from '@tanstack/react-query';
import { getItemsSource } from '@/items/client';
import { STALE_TIME } from '@/stores/queries/consts';
import { FrameGroup } from '@/types/FrameGroup';

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

export const updateFrameGroupsAction = async (queryClient: QueryClient, frameGroups: FrameGroup[], purge = false): Promise<void> => {
  const source = await getItemsSource();
  await source.updateFrameGroups(frameGroups, purge);
  await queryClient.invalidateQueries({ queryKey: frameGroupsKeys.all });
};

export const deleteFrameGroupsByIdsAction = async (queryClient: QueryClient, deleteIds: string[]): Promise<void> => {
  const source = await getItemsSource();
  await source.deleteFrameGroupsByIds(deleteIds);
  await queryClient.invalidateQueries({ queryKey: frameGroupsKeys.all });
};
