import { type IDBPDatabase } from 'idb';
import unique from '@/tools/unique';
import {
  type StoredSerializableImageGroup,
  type ItemsDB,
} from '@/workers/itemsIndexedDbWorker/types';

const MAX_PASSES = 20;

interface GroupSanitizationResult {
  group: StoredSerializableImageGroup;
  didChange: boolean;
}

const sanitizeGroup = (
  group: StoredSerializableImageGroup,
  validImageHashes: Set<string>,
  validGroupIds: Set<string>,
): GroupSanitizationResult => {
  const images = unique(
    group.images.filter((imageHash) => {
      return validImageHashes.has(imageHash);
    }),
  );

  const groups = unique(
    group.groups.filter((groupId) => {
      return validGroupIds.has(groupId);
    }),
  );

  const coverImage = (group.coverImage && validImageHashes.has(group.coverImage)) ? group.coverImage : null;

  const didChange = images.length !== group.images.length
    || groups.length !== group.groups.length
    || coverImage !== group.coverImage;

  const changedGroup: StoredSerializableImageGroup = {
    ...group,
    images,
    groups,
    coverImage,
  };

  return {
    group: changedGroup,
    didChange,
  };
};

const isEmptyGroup = (group: StoredSerializableImageGroup): boolean => {
  return !group.images.length && !group.groups.length;
};

// Loads a fresh snapshot of all groups, sanitizes and persists each one immediately,
// deleting it if it ends up empty. Returns whether any group was deleted this pass,
// so the caller knows whether another pass is needed to catch newly-dangling
// references to groups deleted just now.
const runPass = async (
  db: IDBPDatabase<ItemsDB>,
  validImageHashes: Set<string>,
): Promise<boolean> => {
  const groups = await db.getAll('imagegroups');
  const validGroupIds = new Set(groups.map((group) => group.id));

  let hasDeletedAny = false;

  for (const group of groups) {
    const { group: sanitized, didChange } = sanitizeGroup(group, validImageHashes, validGroupIds);

    if (isEmptyGroup(sanitized)) {
      await db.delete('imagegroups', sanitized.id);
      hasDeletedAny = true;
      continue;
    }

    if (didChange) {
      await db.put('imagegroups', sanitized);
    }
  }

  return hasDeletedAny;
};

export const reconcileImageGroups = async (
  db: IDBPDatabase<ItemsDB>,
): Promise<void> => {
  const startPasses = performance.now();
  const validImageHashes = new Set(await db.getAllKeys('images'));

  let pass = 0;
  for (; pass < MAX_PASSES; pass += 1) {
    const hasDeletedAny = await runPass(db, validImageHashes);

    if (!hasDeletedAny) {
      break;
    }
  }

  console.log(`${pass + 1} cleaning pass(es) took ${Math.round(performance.now() - startPasses)}ms`);
};
