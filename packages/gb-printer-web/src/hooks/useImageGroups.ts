import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import {
  deleteImageGroupsByIdsAction,
  findGroupByFullSlug,
  imageGroupsFullTreeQueryOptions,
  imageGroupsListQueryOptions,
  moveImagesToGroupAction,
  updateImageGroupAction,
  updateImageGroupsAction,
} from '@/stores/items/queries/imageGroups';
import { cleanFullSlug } from '@/tools/cleanSlug';
import {
  type SerializableImageGroup,
  type TreeImageGroup,
} from '@/types/ImageGroup';

export interface UseImageGroupsOptions {
  list?: boolean;
  tree?: boolean;
  bySlug?: string;
}

export interface UseImageGroups {
  imageGroups: SerializableImageGroup[];
  isLoadingList: boolean;
  imageGroupTree: TreeImageGroup | null;
  isLoadingTree: boolean;
  byFullSlug: TreeImageGroup | null;
  isLoadingByFullSlug: boolean;
  moveImagesToGroup: (images: string[], targetImageGroupId?: string) => Promise<void>;
  updateImageGroups: (imageGroups: SerializableImageGroup[], purge?: boolean) => Promise<void>;
  updateImageGroup: (group: SerializableImageGroup, parentGroupId: string) => Promise<void>;
  deleteImageGroupsByIds: (ids: string[]) => Promise<void>;
}

export const useImageGroups = ({ list, tree, bySlug }: UseImageGroupsOptions): UseImageGroups => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    ...imageGroupsListQueryOptions(),
    enabled: Boolean(list),
    placeholderData: keepPreviousData,
    retry: false,
  });

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

      return findGroupByFullSlug(result.item, cleanFullSlug(bySlug)) ?? null;
    },
    enabled: typeof bySlug === 'string',
    retry: false,
  });

  const updateImageGroups = useCallback(async (imageGroups: SerializableImageGroup[], purge = false): Promise<void> => {
    await updateImageGroupsAction(queryClient, imageGroups, purge);
  }, [queryClient]);

  const updateImageGroup = useCallback(async (group: SerializableImageGroup, parentGroupId: string): Promise<void> => {
    await updateImageGroupAction(queryClient, group, parentGroupId);
  }, [queryClient]);

  const moveImagesToGroup = useCallback(async (images: string[], targetImageGroupId?: string): Promise<void> => {
    await moveImagesToGroupAction(queryClient, images, targetImageGroupId);
  }, [queryClient]);

  const deleteImageGroupsByIds = useCallback(async (deleteIds: string[]): Promise<void> => {
    await deleteImageGroupsByIdsAction(queryClient, deleteIds);
  }, [queryClient]);

  return {
    imageGroups: listQuery.data?.items ?? [],
    isLoadingList: listQuery.isLoading,

    imageGroupTree: treeQuery.data?.item ?? null,
    isLoadingTree: treeQuery.isLoading,

    byFullSlug: byFullSlugQuery.data ?? null,
    isLoadingByFullSlug: byFullSlugQuery.isLoading,

    moveImagesToGroup,
    updateImageGroups,
    updateImageGroup,
    deleteImageGroupsByIds,
  };
};
