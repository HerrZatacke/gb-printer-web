import { SpecialTags, StoredImage } from 'gb-printer-schemas';
import { type Repositories } from '@/types';

const MAX_TREE_DEPTH = 20;

interface GroupAggregates {
  tags: string[];
  specialTags: SpecialTags[];
  palettes: string[];
  frames: string[];
  coverImage: string | null;
}

const newSet = (params?: GroupAggregates): GroupAggregates => {
  const {
    tags = [],
    specialTags = [],
    frames = [],
    palettes = [],
    coverImage = null,
  } = params || {};

  return {
    tags,
    specialTags,
    frames,
    palettes,
    coverImage,
  };
};

const resolveGroupAggregates = (
  groupId: string,
  depth: number,
  groupsById: Map<string, { images: string[]; groups: string[] }>,
  aggregatesByImageHash: Map<string, GroupAggregates>,
  resolvedAggregatesById: Map<string, GroupAggregates>,
): GroupAggregates => {
  const cached = resolvedAggregatesById.get(groupId);
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
  let coverImage: string | null = null;

  for (const hash of group.images) {
    const imageTags = aggregatesByImageHash.get(hash) ?? newSet();
    coverImage = coverImage || hash;
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
    const childGroupAggregates = resolveGroupAggregates(childId, depth + 1, groupsById, aggregatesByImageHash, resolvedAggregatesById);
    coverImage = coverImage || childGroupAggregates.coverImage;
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
    coverImage,
  };

  resolvedAggregatesById.set(groupId, resolved);
  return resolved;
};

export const populateGroupAggregates = async (
  repositories: Repositories,
): Promise<void> => {
  const groups = await repositories.imagegroups.getAll();
  const images = await repositories.images.getAll();

  const groupsById = new Map(groups.map((group) => [group.id, group]));
  const aggregatesByImageHash = new Map<string, GroupAggregates>(images.map((image: StoredImage): [string, GroupAggregates] => ([
    image.hash,
    newSet({
      tags: image.tags,
      specialTags: image.specialTags,
      frames: image.frame ? [image.frame] : [],
      palettes: typeof image.palette === 'string' ? [image.palette] : [],
      coverImage: image.hash,
    }),
  ])));
  const resolvedAggregatesById = new Map<string, GroupAggregates>();


  const updatedGroups = groups.map((group) => {
    const aggregates = resolveGroupAggregates(group.id, 0, groupsById, aggregatesByImageHash, resolvedAggregatesById);
    const coverImage = group.coverImage || aggregates.coverImage;
    return { ...group, ...aggregates, coverImage };
  });

  await repositories.imagegroups.put(
    updatedGroups.map((group) => ({ key: group.id, value: group })),
  );
};
