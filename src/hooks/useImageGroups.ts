import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getItemsSource } from '@/items/client';
import {
  imageGroupsFullTreeQueryOptions,
  imageGroupsKeys, findGroupByFullSlug,
} from '@/stores/queries/imageGroups';
import {
  type NewSerializableImageGroup,
  type NewTreeImageGroup,
} from '@/types/ImageGroup';

export interface UseImageGroupsOptions {
  tree?: boolean;
  bySlug?: string;
}

export interface UseImageGroups {
  imageGroupTree: NewTreeImageGroup | null;
  totalCount: number;
  isLoadingTree: boolean;
  byFullSlug: NewTreeImageGroup | null;
  isLoadingByFullSlug: boolean;
  updateImageGroups: (imageGroups: NewSerializableImageGroup[]) => Promise<void>;
  deleteImageGroupsByIds: (ids: string[]) => Promise<void>;
}

export const useImageGroups = ({ tree, bySlug }: UseImageGroupsOptions): UseImageGroups => {
  const queryClient = useQueryClient();

  const treeQuery = useQuery({
    ...imageGroupsFullTreeQueryOptions(),
    enabled: Boolean(tree),
    placeholderData: keepPreviousData,
    retry: false,
  });

  const byFullSlugQuery = useQuery({
    ...imageGroupsFullTreeQueryOptions(),
    select: (result) => {
      if (typeof bySlug !== 'string') {
        return null;
      }
      return findGroupByFullSlug(result.item, bySlug) ?? null;
    },
    enabled: typeof bySlug === 'string',
    placeholderData: keepPreviousData,
    retry: false,
  });

  const updateImageGroups = useCallback(async (imageGroups: NewSerializableImageGroup[]): Promise<void> => {
    const source = await getItemsSource();
    await source.updateImageGroups(imageGroups);
    await queryClient.invalidateQueries({ queryKey: imageGroupsKeys.all });
  }, [queryClient]);

  const deleteImageGroupsByIds = useCallback(async (deleteIds: string[]): Promise<void> => {
    const source = await getItemsSource();
    await source.deleteImageGroupsByIds(deleteIds);
    await queryClient.invalidateQueries({ queryKey: imageGroupsKeys.all });
  }, [queryClient]);

  return {
    imageGroupTree: treeQuery.data?.item ?? null,
    totalCount: treeQuery.data?.totalCount ?? 0,
    isLoadingTree: treeQuery.isLoading,

    byFullSlug: byFullSlugQuery.data ?? null,
    isLoadingByFullSlug: byFullSlugQuery.isLoading,

    updateImageGroups,
    deleteImageGroupsByIds,
  };
};
