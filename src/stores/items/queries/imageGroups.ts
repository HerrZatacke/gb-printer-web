import { QueryClient } from '@tanstack/react-query';
import { getItemsSource } from '@/stores/items/client';
import { imageGroupsKeys } from '@/stores/items/queries/cacheKeys';
import { resetImageGroupCaches } from '@/stores/items/queries/cacheResets';
import { STALE_TIME } from '@/stores/items/queries/consts';
import unique from '@/tools/unique';
import { type SerializableImageGroup, type TreeImageGroup } from '@/types/ImageGroup';
import { ROOT_ID } from '@/workers/itemsIndexedDbWorker/queries/helpers/createTreeRoot';

export const findGroupByFullSlug = (
  group: TreeImageGroup,
  fullSlug: string,
): TreeImageGroup | null => {
  if (group.fullSlug === fullSlug) {
    return group;
  }

  for (const child of group.groups) {
    const found = findGroupByFullSlug(child, fullSlug);
    if (found) {
      return found;
    }
  }

  return null;
};

const computeImageGroupUpdateDiff = (
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
  if (parentGroupId?.length) {
    for (const other of allGroups) {
      if (other.id === parentGroupId || !other.groups.includes(group.id)) {
        continue;
      }
      const current = groupsById.get(other.id) ?? other;
      setGroup({ ...current, groups: current.groups.filter((id) => id !== group.id) });
    }

    // attach this group under its intended parent -> attaching to ROOT is implied for orphaned images
    if (parentGroupId !== ROOT_ID) {
      const parentGroup = groupsById.get(parentGroupId);
      if (!parentGroup) {
        throw new Error(`Parent group "${parentGroupId}" not found`);
      }
      if (!parentGroup.groups.includes(group.id)) {
        setGroup({ ...parentGroup, groups: [...parentGroup.groups, group.id] });
      }
    }
  }

  return [...changedIds].map((id) => groupsById.get(id)!);
};


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


export const imageGroupsFullTreeQueryOptions = () => {
  return {
    queryKey: imageGroupsKeys.fullTree,
    queryFn: async () => {
      const source = await getItemsSource();
      return source.getImageGroupsFullTree();
    },
    staleTime: STALE_TIME,
  };
};

export const imageGroupsListQueryOptions = () => {
  return {
    queryKey: imageGroupsKeys.list,
    queryFn: async () => {
      const source = await getItemsSource();
      return source.getImageGroupsList();
    },
    staleTime: STALE_TIME,
  };
};


export const updateImageGroupsAction = async (queryClient: QueryClient, imageGroups: SerializableImageGroup[], purge = false): Promise<void> => {
  const source = await getItemsSource();
  await source.updateImageGroups(imageGroups, purge);
  await resetImageGroupCaches(queryClient);
};


export const updateImageGroupAction = async (queryClient: QueryClient, group: SerializableImageGroup, parentGroupId: string): Promise<void> => {
  if (group.id === parentGroupId) {
    throw new Error('A group cannot be its own parent');
  }

  const { items: allGroups } = await queryClient.fetchQuery({
    ...imageGroupsListQueryOptions(),
    // ensure "fresh" dataset
    staleTime: 0,
  });
  const changedGroups = computeImageGroupUpdateDiff(allGroups, group, parentGroupId);

  const source = await getItemsSource();
  await source.updateImageGroups(changedGroups, false);
  await resetImageGroupCaches(queryClient);
};


export const moveImagesToGroupAction = async (queryClient: QueryClient, images: string[], targetImageGroupId?: string): Promise<void> => {
  const { items: allGroups } = await queryClient.fetchQuery({
    ...imageGroupsListQueryOptions(),
    // ensure "fresh" dataset
    staleTime: 0,
  });
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
  await resetImageGroupCaches(queryClient);
};


export const deleteImageGroupsByIdsAction = async (queryClient: QueryClient, deleteIds: string[]): Promise<void> => {
  const source = await getItemsSource();
  await source.deleteImageGroupsByIds(deleteIds);
  await resetImageGroupCaches(queryClient);
};
