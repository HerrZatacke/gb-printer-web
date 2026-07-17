import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getItemsSource } from '@/items/client';
import {
  findGroupByFullSlug,
  imageGroupsFullTreeQueryOptions,
  imageGroupsKeys,
  imageGroupsListQueryOptions,
} from '@/stores/queries/imageGroups';
import {
  type NewSerializableImageGroup,
  type NewTreeImageGroup,
} from '@/types/ImageGroup';

export interface UseImageGroupsOptions {
  list?: boolean;
  tree?: boolean;
  bySlug?: string;
}

export interface UseImageGroups {
  imageGroups: NewSerializableImageGroup[];
  totalCount: number;
  isLoadingList: boolean;
  imageGroupTree: NewTreeImageGroup | null;
  isLoadingTree: boolean;
  byFullSlug: NewTreeImageGroup | null;
  isLoadingByFullSlug: boolean;
  updateImageGroups: (imageGroups: NewSerializableImageGroup[], purge?: boolean) => Promise<void>;
  updateImageGroup: (group: NewSerializableImageGroup, parentGroupId: string) => Promise<void>;
  deleteImageGroupsByIds: (ids: string[]) => Promise<void>;
}

export const computeImageGroupUpdateDiff = (
  group: NewSerializableImageGroup,
  parentGroupId: string,
  allGroups: NewSerializableImageGroup[],
): NewSerializableImageGroup[] => {
  const groupsById = new Map<string, NewSerializableImageGroup>(allGroups.map((g) => [g.id, g]));
  const changedIds = new Set<string>();

  const setGroup = (updated: NewSerializableImageGroup) => {
    groupsById.set(updated.id, updated);
    changedIds.add(updated.id);
  };

  setGroup(group);

  // remove this group's images from every other group that currently lists them
  const ownImageIds = new Set(group.images);
  for (const other of allGroups) {
    if (other.id === group.id) {
      continue;
    }
    const remainingImages = other.images.filter((id) => !ownImageIds.has(id));
    if (remainingImages.length !== other.images.length) {
      setGroup({ ...(groupsById.get(other.id) ?? other), images: remainingImages });
    }
  }

  // detach this group from any parent other than the intended one
  for (const other of allGroups) {
    if (other.id === parentGroupId || !other.groups.includes(group.id)) {
      continue;
    }
    const current = groupsById.get(other.id) ?? other;
    setGroup({ ...current, groups: current.groups.filter((id) => id !== group.id) });
  }

  // attach this group under its intended parent
  const parentGroup = groupsById.get(parentGroupId);
  if (!parentGroup) {
    throw new Error(`Parent group "${parentGroupId}" not found`);
  }
  if (!parentGroup.groups.includes(group.id)) {
    setGroup({ ...parentGroup, groups: [...parentGroup.groups, group.id] });
  }

  return [...changedIds].map((id) => groupsById.get(id)!);
};

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
      return findGroupByFullSlug(result.item, bySlug) ?? null;
    },
    enabled: typeof bySlug === 'string',
    placeholderData: keepPreviousData,
    retry: false,
  });

  const updateImageGroups = useCallback(async (imageGroups: NewSerializableImageGroup[], purge = false): Promise<void> => {
    const source = await getItemsSource();
    await source.updateImageGroups(imageGroups, purge);
    await queryClient.invalidateQueries({ queryKey: imageGroupsKeys.all });
  }, [queryClient]);

  const updateImageGroup = useCallback(async (group: NewSerializableImageGroup, parentGroupId: string): Promise<void> => {
    if (group.id === parentGroupId) {
      throw new Error('A group cannot be its own parent');
    }

    // invalidate initially to ensure "fresh" dataset
    await queryClient.invalidateQueries({ queryKey: imageGroupsKeys.all });
    const { items: allGroups } = await queryClient.fetchQuery(imageGroupsListQueryOptions());
    const changedGroups = computeImageGroupUpdateDiff(group, parentGroupId, allGroups);

    const source = await getItemsSource();
    await source.updateImageGroups(changedGroups, false);
    await queryClient.invalidateQueries({ queryKey: imageGroupsKeys.all });
  }, [queryClient]);

  const deleteImageGroupsByIds = useCallback(async (deleteIds: string[]): Promise<void> => {
    const source = await getItemsSource();
    await source.deleteImageGroupsByIds(deleteIds);
    await queryClient.invalidateQueries({ queryKey: imageGroupsKeys.all });
  }, [queryClient]);

  return {
    imageGroups: listQuery.data?.items ?? [],
    totalCount: listQuery.data?.paging.total ?? 0,
    isLoadingList: listQuery.isLoading,

    imageGroupTree: treeQuery.data?.item ?? null,
    isLoadingTree: treeQuery.isLoading,

    byFullSlug: byFullSlugQuery.data ?? null,
    isLoadingByFullSlug: byFullSlugQuery.isLoading,

    updateImageGroups,
    updateImageGroup,
    deleteImageGroupsByIds,
  };
};
