import { type IDBPDatabase } from 'idb';
import { SpecialTags } from '@/consts/SpecialTags';
import { type ItemsDB, StoredImage } from '@/workers/itemsIndexedDbWorker/types';

const MAX_TREE_DEPTH = 20;

interface GroupAggregates {
  tags: string[];
  specialTags: SpecialTags[];
  palettes: string[];
  frames: string[];
}

interface NewSetParams {
  tags: string[];
  specialTags: SpecialTags[];
  frames: string[];
  palettes: string[];
}

const newSet = (params?: NewSetParams): GroupAggregates => {
  const {
    tags = [],
    specialTags = [],
    frames = [],
    palettes = [],
  } = params || {};

  return {
    tags,
    specialTags,
    frames,
    palettes,
  };
};

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
  const frameSet = new Set<string>();
  const paletteSet = new Set<string>();

  for (const hash of group.images) {
    const imageTags = tagsByImageHash.get(hash) ?? newSet();
    for (const tag of imageTags.tags) {
      tagSet.add(tag);
    }
    for (const specialTag of imageTags.specialTags) {
      specialTagSet.add(specialTag);
    }
    for (const frame of imageTags.frames) {
      frameSet.add(frame);
    }
    for (const palette of imageTags.palettes) {
      paletteSet.add(palette);
    }
  }

  for (const childId of group.groups) {
    const childGroupAggregates = resolveGroupTags(childId, depth + 1, groupsById, tagsByImageHash, resolvedTagsById);
    for (const tag of childGroupAggregates.tags) {
      tagSet.add(tag);
    }
    for (const specialTag of childGroupAggregates.specialTags) {
      specialTagSet.add(specialTag);
    }
    for (const frame of childGroupAggregates.frames) {
      frameSet.add(frame);
    }
    for (const palette of childGroupAggregates.palettes) {
      paletteSet.add(palette);
    }
  }

  const resolved: GroupAggregates = {
    tags: [...tagSet].sort(),
    specialTags: [...specialTagSet].sort(),
    frames: [...frameSet].sort(),
    palettes: [...paletteSet].sort(),
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
    newSet({
      tags: image.tags,
      specialTags: image.specialTags,
      frames: image.frame ? [image.frame] : [],
      palettes: typeof image.palette === 'string' ? [image.palette] : [],
    }),
  ])));
  const resolvedTagsById = new Map<string, GroupAggregates>();

  const tx = db.transaction('imagegroups', 'readwrite');
  for (const group of groups) {
    const tags = resolveGroupTags(group.id, 0, groupsById, tagsByImageHash, resolvedTagsById);
    await tx.store.put({ ...group, ...tags });
  }
  await tx.done;
};
