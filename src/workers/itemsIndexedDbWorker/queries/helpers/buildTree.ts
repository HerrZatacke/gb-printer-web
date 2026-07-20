import { type SerializableImageGroup, type TreeImageGroup } from '@/types/ImageGroup';

const MAX_TREE_DEPTH = 20;

export const buildTree = (
  groupId: string,
  groupsById: Map<string, SerializableImageGroup>,
  childGroupIdsByParent: Map<string, string[]>,
  imageIdsByGroup: Map<string, string[]>,
  depth: number,
): TreeImageGroup | null => {
  const group: SerializableImageGroup | undefined = groupsById.get(groupId);

  if (!group) {
    return null;
  }

  if (depth > MAX_TREE_DEPTH) {
    console.error(`Group tree exceeds max depth (${MAX_TREE_DEPTH}) at "${groupId}" — likely a cycle, aborting this branch`);
    return null;
  }

  const children = (childGroupIdsByParent.get(groupId) ?? [])
    .map((childId) => buildTree(childId, groupsById, childGroupIdsByParent, imageIdsByGroup, depth + 1))
    .filter((child): child is TreeImageGroup => child !== null);

  return {
    ...group,
    totalImages: NaN, // Populated later by "applyImageTotals"
    fullSlug: '', // Populated later by "applyFullSlugs"
    images: imageIdsByGroup.get(groupId) ?? [],
    groups: children,
  };
};
