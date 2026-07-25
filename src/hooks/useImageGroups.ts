import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getItemsSource } from '@/items/client';
import {
  findGroupByFullSlug,
  imageGroupsFullTreeQueryOptions,
  imageGroupsKeys,
  imageGroupsListQueryOptions,
} from '@/stores/queries/imageGroups';
import { cleanFullSlug } from '@/tools/cleanSlug';
import unique from '@/tools/unique';
import {
  type SerializableImageGroup,
  type TreeImageGroup,
} from '@/types/ImageGroup';
import { ROOT_ID } from '@/workers/itemsIndexedDbWorker/queries/helpers/createTreeRoot';
import { ItemsSourcePaging } from '@/workers/itemsIndexedDbWorker/types';

export interface UseImageGroupsOptions {
  list?: boolean;
  tree?: boolean;
  bySlug?: string;
}

export interface UseImageGroups {
  imageGroups: SerializableImageGroup[];
  paging: ItemsSourcePaging | null;
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

const removeImagesFromGroups = (allGroups: SerializableImageGroup[], imagesToRemove: string[]): SerializableImageGroup[] => {
  const changedGroups = new Set<SerializableImageGroup>();
  const ownImageIds = new Set(imagesToRemove);
  for (const other of allGroups) {
    const remainingImages = other.images.filter((id) => !ownImageIds.has(id));
    if (remainingImages.length !== other.images.length) {
      changedGroups.add({
        ...other,
        images: remainingImages,
      });
    }
  }

  return [...changedGroups];
};

export const computeImageGroupUpdateDiff = (
  allGroups: SerializableImageGroup[],
  group: SerializableImageGroup,
  parentGroupId?: string,
): SerializableImageGroup[] => {
  const groupsById = new Map<string, SerializableImageGroup>(allGroups.map((g) => [g.id, g]));
  const changedIds = new Set<string>();

  const setGroup = (updated: SerializableImageGroup) => {
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
  if (parentGroupId?.length && parentGroupId !== ROOT_ID) {
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

      return findGroupByFullSlug(result.item, cleanFullSlug(bySlug)) ?? null;
    },
    enabled: typeof bySlug === 'string',
    retry: false,
  });

  const updateImageGroups = useCallback(async (imageGroups: SerializableImageGroup[], purge = false): Promise<void> => {
    const source = await getItemsSource();
    await source.updateImageGroups(imageGroups, purge);
    await queryClient.invalidateQueries({ queryKey: imageGroupsKeys.all });
  }, [queryClient]);

  const updateImageGroup = useCallback(async (group: SerializableImageGroup, parentGroupId: string): Promise<void> => {
    if (group.id === parentGroupId) {
      throw new Error('A group cannot be its own parent');
    }

    // invalidate initially to ensure "fresh" dataset
    await queryClient.invalidateQueries({ queryKey: imageGroupsKeys.all });
    const { items: allGroups } = await queryClient.fetchQuery(imageGroupsListQueryOptions());
    const changedGroups = computeImageGroupUpdateDiff(allGroups, group, parentGroupId);

    const source = await getItemsSource();
    await source.updateImageGroups(changedGroups, false);
    await queryClient.invalidateQueries({ queryKey: imageGroupsKeys.all });
  }, [queryClient]);

  const moveImagesToGroup = useCallback(async (images: string[], targetImageGroupId?: string): Promise<void> => {
    await queryClient.invalidateQueries({ queryKey: imageGroupsKeys.all });
    const { items: allGroups } = await queryClient.fetchQuery(imageGroupsListQueryOptions());
    const newImageParentGroup = (targetImageGroupId && allGroups.find((g) => g.id === targetImageGroupId)) || null;

    let changedGroups: SerializableImageGroup[];

    if (newImageParentGroup) {
      const changedGroup: SerializableImageGroup = {
        ...newImageParentGroup,
        images: unique([...newImageParentGroup.images, ...images]),
      };

      // no parentGroupId needed, because group is not being moved
      changedGroups = computeImageGroupUpdateDiff(allGroups, changedGroup);
    } else {
      // No group found to move images to, just remove them from all groups (=move to root)
      changedGroups = removeImagesFromGroups(allGroups, images);
    }

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
    paging: listQuery.data?.paging ?? null,
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
