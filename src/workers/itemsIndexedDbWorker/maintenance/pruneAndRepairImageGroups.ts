import { type IDBPDatabase } from 'idb';
import { SerializableImageGroup } from '@/types/ImageGroup';
import { type ItemsDB } from '@/workers/itemsIndexedDbWorker/types';

const MAX_TREE_DEPTH = 20;

const getValidImageHashes = async (db: IDBPDatabase<ItemsDB>): Promise<Set<string>> => {
  const hashes = await db.getAllKeys('images');

  return new Set(hashes);
};

const getPrunedGroups = async (
  db: IDBPDatabase<ItemsDB>,
  validImageHashes: Set<string>,
): Promise<SerializableImageGroup[]> => {
  const groups = await db.getAll('imagegroups');

  return groups.map((group) => {
    const validImages = group.images.filter((imageHash) => {
      return validImageHashes.has(imageHash);
    });

    return {
      ...group,
      images: validImages,
    };
  });
};

const getDeepImages = (
  groupId: string,
  groupsById: Map<string, SerializableImageGroup>,
  deepImagesCache: Map<string, Set<string>>,
  depth: number = 0,
): Set<string> => {
  const cached = deepImagesCache.get(groupId);
  if (cached) {
    return cached;
  }

  if (depth >= MAX_TREE_DEPTH) {
    return new Set();
  }

  const group = groupsById.get(groupId);
  if (!group) {
    return new Set();
  }

  const deepImages = new Set(group.images);

  for (const childId of group.groups) {
    const childImages = getDeepImages(childId, groupsById, deepImagesCache, depth + 1);
    for (const imageHash of childImages) {
      deepImages.add(imageHash);
    }
  }

  deepImagesCache.set(groupId, deepImages);

  return deepImages;
};

export const pruneAndRepairImageGroups = async (
  db: IDBPDatabase<ItemsDB>,
): Promise<void> => {
  const validImageHashes = await getValidImageHashes(db);
  const groups = await getPrunedGroups(db, validImageHashes);

  const groupsById = new Map<string, SerializableImageGroup>();
  for (const group of groups) {
    groupsById.set(group.id, group);
  }

  const deepImagesCache = new Map<string, Set<string>>();

  for (const group of groups) {
    const deepImages = getDeepImages(group.id, groupsById, deepImagesCache);

    if (!deepImages.has(group.coverImage)) {
      const [firstAvailable] = deepImages;
      group.coverImage = firstAvailable ?? '';
    }
  }

  const deletedGroupIds = new Set<string>();
  let hasNewlyDeleted = true;

  while (hasNewlyDeleted) {
    hasNewlyDeleted = false;

    for (const group of groups) {
      if (deletedGroupIds.has(group.id)) {
        continue;
      }

      const remainingChildIds = group.groups.filter((childId) => {
        return !deletedGroupIds.has(childId);
      });

      if (!group.images.length && !remainingChildIds.length) {
        deletedGroupIds.add(group.id);
        hasNewlyDeleted = true;
      }
    }
  }

  const tx = db.transaction('imagegroups', 'readwrite');
  const groupsStore = tx.objectStore('imagegroups');

  for (const group of groups) {
    if (deletedGroupIds.has(group.id)) {
      await groupsStore.delete(group.id);
      continue;
    }

    group.groups = group.groups.filter((childId) => {
      return !deletedGroupIds.has(childId);
    });

    await groupsStore.put(group);
  }

  await tx.done;
};
