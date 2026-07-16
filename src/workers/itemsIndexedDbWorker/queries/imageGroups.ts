import z from 'zod';
import {
  type NewTreeImageGroup,
  NewSerializableImageGroupSchema,
  type NewSerializableImageGroup,
} from '@/types/ImageGroup';
import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { applyFullSlugs } from '@/workers/itemsIndexedDbWorker/queries/helpers/applyFullSugs';
import { applyImageTotals } from '@/workers/itemsIndexedDbWorker/queries/helpers/applyImageTotals';
import { buildTree } from '@/workers/itemsIndexedDbWorker/queries/helpers/buildTree';
import { createTreeRoot } from '@/workers/itemsIndexedDbWorker/queries/helpers/createTreeRoot';
import { resolveOwnership } from '@/workers/itemsIndexedDbWorker/queries/helpers/resolveOwnership';
import { RootItemSourceResponse } from '@/workers/itemsIndexedDbWorker/types';

export const getImageGroupsFullTree = async (): Promise<RootItemSourceResponse<NewTreeImageGroup>> => {
  const db = await getDb();
  const start = performance.now();

  const groupsStore = db.transaction('imagegroups').store;
  const imagesStore = db.transaction('images').store;

  const [imageGroups, totalCount, allImageIds] = await Promise.all([
    groupsStore.getAll(),
    groupsStore.count(),
    imagesStore.getAllKeys(),
  ]);

  const { success, error, data: parsedImageGroups } = z.array(NewSerializableImageGroupSchema).safeParse(imageGroups);
  if (!success) {
    console.error(error.message);
    throw error;
  }

  const {
    childGroupIdsByParent,
    imageIdsByGroup,
    topLevelGroupIds,
    orphanedImageIds,
  } = resolveOwnership(parsedImageGroups, allImageIds);

  const groupsById = new Map(parsedImageGroups.map((group) => [group.id, group]));

  const topLevelGroups = topLevelGroupIds
    .map((id) => buildTree(id, groupsById, childGroupIdsByParent, imageIdsByGroup, 0))
    .filter((group): group is NewTreeImageGroup => group !== null);

  const treeRoot = createTreeRoot(topLevelGroups, orphanedImageIds);
  const treeRootWithTotals = applyImageTotals(treeRoot);
  const root = applyFullSlugs(treeRootWithTotals);

  return {
    item: root,
    totalCount,
    duration: performance.now() - start,
  };
};

export const updateImageGroups = async (imageGroups: NewSerializableImageGroup[]): Promise<void> => {
  const { success, data: parsedGroups, error } = z.array(NewSerializableImageGroupSchema).safeParse(imageGroups);
  if (success) {
    const db = await getDb();

    const tx = db.transaction('imagegroups', 'readwrite');
    const store = tx.store;

    await Promise.all(parsedGroups.map((group) => store.put(group)));
    await tx.done;
  } else {
    console.error(error);
  }
};

export const deleteImageGroupsByIds = async (): Promise<void> => {
  console.warn(self.constructor.name, 'Not implemented');
  return undefined;
};
