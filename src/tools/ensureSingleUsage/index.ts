import type { SerializableImageGroup } from '@/types/ImageGroup';

export interface SingleUsageResult {
  groups: SerializableImageGroup[],
  usedImageHashes: string[],
  usedGroupIDs: string[],
}

export const ensureSingleUsage = (groups: SerializableImageGroup[]): SingleUsageResult => {
  const usedImageHashes = new Set<string>();
  const usedGroupIDs = new Set<string>();

  const cleanGroup = (checkGroup: SerializableImageGroup): SerializableImageGroup => {
    const filteredImages: string[] = [];
    for (const imageHash of checkGroup.images) {
      if (!usedImageHashes.has(imageHash)) {
        usedImageHashes.add(imageHash);
        filteredImages.push(imageHash);
      }
    }

    const filteredGroups: string[] = [];
    for (const groupId of checkGroup.groups) {
      if (!usedGroupIDs.has(groupId)) {
        usedGroupIDs.add(groupId);
        filteredGroups.push(groupId);
      }
    }

    return {
      ...checkGroup,
      images: filteredImages,
      groups: filteredGroups,
    };
  };

  return {
    groups: groups.map(cleanGroup),
    usedImageHashes: Array.from(usedImageHashes),
    usedGroupIDs: Array.from(usedGroupIDs),
  };
};
