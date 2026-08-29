import {
  ItemStoreNames,
  type ItemsInvalidation,
  type StoredSerializableImageGroup,
} from 'gb-printer-schemas';
import unique from '@/temptools/unique';
import { type Repositories } from '@/types';

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
  repositories: Repositories,
  groups: StoredSerializableImageGroup[],
  validImageHashes: Set<string>,
): Promise<[boolean, boolean]> => {
  const validGroupIds = new Set(groups.map((group) => group.id));

  let hasDeletedAny = false;
  let didChangeAny = false;

  for (const group of groups) {
    const { group: sanitized, didChange } = sanitizeGroup(group, validImageHashes, validGroupIds);

    if (isEmptyGroup(sanitized)) {
      await repositories.imagegroups.deleteByKeys([sanitized.id]);
      hasDeletedAny = true;
      continue;
    }

    if (didChange) {
      didChangeAny = true;
      await repositories.imagegroups.put([
        {
          key: sanitized.id,
          value: sanitized,
        },
      ]);
    }
  }

  return [hasDeletedAny, didChangeAny];
};

export const reconcileImageGroups = async (
  repositories: Repositories,
): Promise<ItemsInvalidation[]> => {
  const startPasses = performance.now();
  const validImageHashes = new Set(await repositories.images.getAllKeys());
  const groups = await repositories.imagegroups.getAll();

  let mustInvalidate: boolean = false;

  let pass = 0;
  for (; pass < MAX_PASSES; pass += 1) {
    const [hasDeletedAny, didChangeAny] = await runPass(repositories, groups, validImageHashes);

    mustInvalidate = mustInvalidate || hasDeletedAny || didChangeAny;

    if (!hasDeletedAny) {
      break;
    }
  }

  console.log(`${pass + 1} cleaning pass(es) took ${Math.round(performance.now() - startPasses)}ms`);

  if (!mustInvalidate) {
    return [];
  }

  return [{
    collection: ItemStoreNames.IMAGEGROUPS,
  }];
};
