import unique from '@/tools/unique';
import type { SerializableImageGroup } from '@/types/ImageGroup';

export interface SingleUsageResult {
  groups: SerializableImageGroup[],
  usedImageHashes: string[],
  usedGroupIDs: string[],
}

const arrayDifference = (arrayA: string[], arrayB: string[]): string[] => (
  arrayA.filter((x) => !arrayB.includes(x))
);

export const ensureSingleUsage = (groups: SerializableImageGroup[]): SingleUsageResult => {
  let usedImageHashes: string[] = [];
  let usedGroupIDs: string[] = [];

  const check = (checkGroup: SerializableImageGroup): SerializableImageGroup => {
    // unique will remove duplicate images inside a single group
    // which could happen when json exports are manually edited
    const uniqueImages = unique(arrayDifference(checkGroup?.images, usedImageHashes));
    const uniqueGroups = unique(arrayDifference(checkGroup?.groups, usedGroupIDs));

    usedImageHashes = unique([...usedImageHashes, ...checkGroup.images]);
    usedGroupIDs = unique([...usedGroupIDs, ...checkGroup.groups]);

    return {
      ...checkGroup,
      images: uniqueImages,
      groups: uniqueGroups,
    };
  };

  return {
    groups: groups.map(check),
    usedImageHashes,
    usedGroupIDs,
  };
};
