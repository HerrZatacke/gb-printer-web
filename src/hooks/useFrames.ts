import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getItemsSource } from '@/items/client';
import {
  framesKeys,
  framesByIdsQueryOptions,
  framesListQueryOptions,
} from '@/stores/queries/frames';
import { Frame } from '@/types/Frame';
import { ItemsSourcePaging } from '@/workers/itemsIndexedDbWorker/types';

export interface UseFrames {
  frames: Frame[];
  paging: ItemsSourcePaging | null;
  isLoadingList: boolean;
  byIds: Frame[];
  isLoadingByIds: boolean;
  updateFrames: (frames: Frame[], purge?: boolean) => Promise<void>;
  deleteFramesByIds: (ids: string[]) => Promise<void>;
}

export interface UseFramesOptions {
  list?: boolean;
  ids?: string[];
}

export const useFrames = ({ list, ids }: UseFramesOptions): UseFrames => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    ...framesListQueryOptions(),
    enabled: Boolean(list),
    placeholderData: keepPreviousData,
    retry: false,
  });

  const byIdsQuery = useQuery({
    ...framesByIdsQueryOptions(ids || []),
    enabled: Boolean(ids?.length),
    placeholderData: keepPreviousData,
    retry: false,
  });

  const updateFrames = useCallback(async (frames: Frame[], purge = false): Promise<void> => {
    const source = await getItemsSource();
    await source.updateFrames(frames, purge);
    await queryClient.invalidateQueries({ queryKey: framesKeys.all });
  }, [queryClient]);

  const deleteFramesByIds = useCallback(async (deleteIds: string[]): Promise<void> => {
    const source = await getItemsSource();
    await source.deleteFramesByIds(deleteIds);
    await queryClient.invalidateQueries({ queryKey: framesKeys.all });
  }, [queryClient]);

  return {
    frames: listQuery.data?.items ?? [],
    paging: listQuery.data?.paging ?? null,
    isLoadingList: listQuery.isLoading,

    byIds: byIdsQuery.data?.items ?? [],
    isLoadingByIds: byIdsQuery.isLoading,

    updateFrames,
    deleteFramesByIds,
  };
};
