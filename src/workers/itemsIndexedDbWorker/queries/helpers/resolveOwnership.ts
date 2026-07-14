import { type NewSerializableImageGroup } from '@/types/ImageGroup';

interface OwnershipResult {
  childGroupIdsByParent: Map<string, string[]>;
  imageIdsByGroup: Map<string, string[]>;
  topLevelGroupIds: string[];
  orphanedImageIds: string[];
}

export const resolveOwnership = (
  groups: NewSerializableImageGroup[],
  allImageIds: string[],
): OwnershipResult => {
  const claimedGroups = new Set<string>();
  const claimedImages = new Set<string>();
  const childGroupIdsByParent = new Map<string, string[]>();
  const imageIdsByGroup = new Map<string, string[]>();

  for (const group of groups) {
    const ownedChildren = group.groups.filter((id) => !claimedGroups.has(id) && claimedGroups.add(id));
    const ownedImages = group.images.filter((id) => !claimedImages.has(id) && claimedImages.add(id));

    childGroupIdsByParent.set(group.id, ownedChildren);
    imageIdsByGroup.set(group.id, ownedImages);
  }

  const topLevelGroupIds = groups.map((g) => g.id).filter((id) => !claimedGroups.has(id));
  const orphanedImageIds = allImageIds.filter((id) => !claimedImages.has(id));

  return {
    childGroupIdsByParent, imageIdsByGroup, topLevelGroupIds, orphanedImageIds,
  };
};
