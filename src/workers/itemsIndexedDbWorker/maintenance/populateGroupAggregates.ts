import { type IDBPDatabase } from 'idb';
import { SpecialTags } from '@/consts/SpecialTags';
import { type ItemsDB, StoredImage } from '@/workers/itemsIndexedDbWorker/types';

const MAX_TREE_DEPTH = 20;

interface GroupAggregates {
  tags: string[];
  specialTags: SpecialTags[];
}

const newSet = (
  tags: string[] = [],
  specialTags: SpecialTags[] = [],
): GroupAggregates => ({ tags, specialTags });

const resolveGroupTags = (
  groupId: string,
  depth: number,
  groupsById: Map<string, { images: string[]; groups: string[] }>,
  tagsByImageHash: Map<string, GroupAggregates>,
  resolvedTagsById: Map<string, GroupAggregates>,
): GroupAggregates => {
  const cached = resolvedTagsById.get(groupId);
  if (cached) {
    return cached;
  }

  if (depth > MAX_TREE_DEPTH) {
    console.error(`Group tree exceeds max depth (${MAX_TREE_DEPTH}) at "${groupId}" — likely a cycle, treating this branch as tagless`);
    return newSet();
  }

  const group = groupsById.get(groupId);
  if (!group) {
    return newSet();
  }

  const tagSet = new Set<string>();
  const specialTagSet = new Set<SpecialTags>();

  for (const hash of group.images) {
    const imageTags = tagsByImageHash.get(hash) ?? newSet();
    for (const tag of imageTags.tags) {
      tagSet.add(tag);
    }
    for (const specialTag of imageTags.specialTags) {
      specialTagSet.add(specialTag);
    }
  }

  for (const childId of group.groups) {
    const childTags = resolveGroupTags(childId, depth + 1, groupsById, tagsByImageHash, resolvedTagsById);
    for (const tag of childTags.tags) {
      tagSet.add(tag);
    }
    for (const specialTag of childTags.specialTags) {
      specialTagSet.add(specialTag);
    }

  }

  const resolvedTags = [...tagSet].sort();
  const resolvedSpecialTags = [...specialTagSet].sort();

  const resolved: GroupAggregates = {
    tags: resolvedTags,
    specialTags: resolvedSpecialTags,
  };

  resolvedTagsById.set(groupId, resolved);
  return resolved;
};

export const populateGroupAggregates = async (
  db: IDBPDatabase<ItemsDB>,
): Promise<void> => {
  const groups = await db.getAll('imagegroups');
  const images = await db.getAll('images');

  const groupsById = new Map(groups.map((group) => [group.id, group]));
  const tagsByImageHash = new Map<string, GroupAggregates>(images.map((image: StoredImage): [string, GroupAggregates] => ([
    image.hash,
    newSet(image.tags, image.specialTags),
  ])));
  const resolvedTagsById = new Map<string, GroupAggregates>();

  const tx = db.transaction('imagegroups', 'readwrite');
  for (const group of groups) {
    const tags = resolveGroupTags(group.id, 0, groupsById, tagsByImageHash, resolvedTagsById);
    await tx.store.put({ ...group, ...tags });
  }
  await tx.done;
};
