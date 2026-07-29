import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import {
  framesByIdsQueryOptions,
  framesListQueryOptions,
  updateFramesAction,
  deleteFramesByIdsAction,
} from '@/stores/queries/frames';
import { Frame } from '@/types/Frame';

export interface UseFrames {
  frames: Frame[];
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
    await updateFramesAction(queryClient, frames, purge);
  }, [queryClient]);

  const deleteFramesByIds = useCallback(async (deleteIds: string[]): Promise<void> => {
    await deleteFramesByIdsAction(queryClient, deleteIds);
  }, [queryClient]);

  return {
    frames: listQuery.data?.items ?? [],
    isLoadingList: listQuery.isLoading,

    byIds: byIdsQuery.data?.items ?? [],
    isLoadingByIds: byIdsQuery.isLoading,

    updateFrames,
    deleteFramesByIds,
  };
};
