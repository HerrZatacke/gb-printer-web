import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getItemsSource } from '@/items/client';
import {
  frameGroupsKeys,
  frameGroupsListQueryOptions,
} from '@/stores/queries/frameGroups';
import { FrameGroup } from '@/types/FrameGroup';

export interface UseFrameGroups2 {
  frameGroups: FrameGroup[];
  totalCount: number;
  isLoadingList: boolean;
  updateFrameGroups: (frameGroups: FrameGroup[]) => Promise<void>;
  deleteFrameGroupsByIds: (ids: string[]) => Promise<void>;
}

export const useFrameGroups2 = (): UseFrameGroups2 => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    ...frameGroupsListQueryOptions(),
    placeholderData: keepPreviousData,
    retry: false,
  });

  const updateFrameGroups = useCallback(async (frameGroups: FrameGroup[]): Promise<void> => {
    const source = await getItemsSource();
    await source.updateFrameGroups(frameGroups);
    queryClient.invalidateQueries({ queryKey: frameGroupsKeys.all });
  }, [queryClient]);

  const deleteFrameGroupsByIds = useCallback(async (deleteIds: string[]): Promise<void> => {
    const source = await getItemsSource();
    await source.deleteFrameGroupsByIds(deleteIds);
    queryClient.invalidateQueries({ queryKey: frameGroupsKeys.all });
  }, [queryClient]);

  return {
    frameGroups: listQuery.data?.items ?? [],
    totalCount: listQuery.data?.paging?.total ?? 0,
    isLoadingList: listQuery.isLoading,

    updateFrameGroups,
    deleteFrameGroupsByIds,
  };
};
