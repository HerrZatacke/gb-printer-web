import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getItemsSource } from '@/items/client';
import {
  imageGroupsFullTreeQueryOptions,
  imageGroupsKeys,
} from '@/stores/queries/imageGroups';
import {
  type NewTreeImageGroup,
  type SerializableImageGroup,
} from '@/types/ImageGroup';

export interface UseImageGroupsOptions {
  tree?: boolean;
}

export interface UseImageGroups {
  imageGroupTree: NewTreeImageGroup | null;
  totalCount: number;
  isLoadingTree: boolean;
  updateImageGroups: (imageGroups: SerializableImageGroup[]) => Promise<void>;
  deleteImageGroupsByIds: (ids: string[]) => Promise<void>;
}

export const useImageGroups = ({ tree }: UseImageGroupsOptions): UseImageGroups => {
  const queryClient = useQueryClient();

  const treeQuery = useQuery({
    ...imageGroupsFullTreeQueryOptions(),
    enabled: Boolean(tree),
    placeholderData: keepPreviousData,
    retry: false,
  });

  const updateImageGroups = useCallback(async (imageGroups: SerializableImageGroup[]): Promise<void> => {
    const source = await getItemsSource();
    await source.updateImageGroups(imageGroups);
    queryClient.invalidateQueries({ queryKey: imageGroupsKeys.all });
  }, [queryClient]);

  const deleteImageGroupsByIds = useCallback(async (deleteIds: string[]): Promise<void> => {
    const source = await getItemsSource();
    await source.deleteImageGroupsByIds(deleteIds);
    queryClient.invalidateQueries({ queryKey: imageGroupsKeys.all });
  }, [queryClient]);

  return {
    imageGroupTree: treeQuery.data?.item ?? null,
    totalCount: treeQuery.data?.totalCount ?? 0,
    isLoadingTree: treeQuery.isLoading,

    updateImageGroups,
    deleteImageGroupsByIds,
  };
};
