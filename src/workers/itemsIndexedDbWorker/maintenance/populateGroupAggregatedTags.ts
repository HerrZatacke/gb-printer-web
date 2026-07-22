import { type IDBPDatabase } from 'idb';
import { type ItemsDB } from '@/workers/itemsIndexedDbWorker/types';

const MAX_TREE_DEPTH = 20;

const resolveGroupTags = (
  groupId: string,
  depth: number,
  groupsById: Map<string, { images: string[]; groups: string[] }>,
  tagsByImageHash: Map<string, string[]>,
  resolvedTagsById: Map<string, string[]>,
): string[] => {
  const cached = resolvedTagsById.get(groupId);
  if (cached) {
    return cached;
  }

  if (depth > MAX_TREE_DEPTH) {
    console.error(`Group tree exceeds max depth (${MAX_TREE_DEPTH}) at "${groupId}" — likely a cycle, treating this branch as tagless`);
    return [];
  }

  const group = groupsById.get(groupId);
  if (!group) {
    return [];
  }

  const tagSet = new Set<string>();

  for (const hash of group.images) {
    const imageTags = tagsByImageHash.get(hash) ?? [];
    for (const tag of imageTags) {
      tagSet.add(tag);
    }
  }

  for (const childId of group.groups) {
    const childTags = resolveGroupTags(childId, depth + 1, groupsById, tagsByImageHash, resolvedTagsById);
    for (const tag of childTags) {
      tagSet.add(tag);
    }
  }

  const resolved = [...tagSet].sort();
  resolvedTagsById.set(groupId, resolved);
  return resolved;
};

export const populateGroupAggregatedTags = async (
  db: IDBPDatabase<ItemsDB>,
): Promise<void> => {
  const groups = await db.getAll('imagegroups');
  const images = await db.getAll('images');

  const groupsById = new Map(groups.map((group) => [group.id, group]));
  const tagsByImageHash = new Map(images.map((image) => [image.hash, image.tags]));
  const resolvedTagsById = new Map<string, string[]>();

  const tx = db.transaction('imagegroups', 'readwrite');
  for (const group of groups) {
    const tags = resolveGroupTags(group.id, 0, groupsById, tagsByImageHash, resolvedTagsById);
    await tx.store.put({ ...group, tags });
  }
  await tx.done;
};
