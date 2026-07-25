import z from 'zod';
import sortBy from '@/tools/sortby';
import {
  type TreeImageGroup,
  SerializableImageGroupSchema,
  type SerializableImageGroup,
} from '@/types/ImageGroup';
import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { applyFullSlugs } from '@/workers/itemsIndexedDbWorker/queries/helpers/applyFullSlugs';
import { applyImageTotals } from '@/workers/itemsIndexedDbWorker/queries/helpers/applyImageTotals';
import { buildTree } from '@/workers/itemsIndexedDbWorker/queries/helpers/buildTree';
import { createTreeRoot } from '@/workers/itemsIndexedDbWorker/queries/helpers/createTreeRoot';
import { getAddPaging } from '@/workers/itemsIndexedDbWorker/queries/helpers/generic';
import { resolveOwnership } from '@/workers/itemsIndexedDbWorker/queries/helpers/resolveOwnership';
import { ItemsSourceResponse, RootItemSourceResponse } from '@/workers/itemsIndexedDbWorker/types';

const sortById = sortBy<SerializableImageGroup>('id');

export const getImageGroupsList = async (): Promise<ItemsSourceResponse<SerializableImageGroup>> => {
  const db = await getDb();
  const start = performance.now();

  const { store } = db.transaction('imagegroups');
  const imageGroups = await store.getAll();
  const total = await store.count();

  const addPaging = getAddPaging<SerializableImageGroup>(total, 0, imageGroups.length, start, SerializableImageGroupSchema);

  return addPaging(imageGroups);
};

export const getImageGroupsFullTree = async (): Promise<RootItemSourceResponse<TreeImageGroup>> => {
  const db = await getDb();
  const start = performance.now();

  const groupsStore = db.transaction('imagegroups').store;
  const imagesStore = db.transaction('images').store;

  const [imageGroups, totalCount, allImageIds] = await Promise.all([
    groupsStore.getAll(),
    groupsStore.count(),
    imagesStore.getAllKeys(),
  ]);

  const { success, error, data: parsedImageGroups } = z.array(SerializableImageGroupSchema).safeParse(imageGroups);
  if (!success) {
    console.error(error.message);
    throw error;
  }

  const sortedParsedImageGroups = sortById(parsedImageGroups);

  const {
    childGroupIdsByParent,
    imageIdsByGroup,
    topLevelGroupIds,
    orphanedImageIds,
  } = resolveOwnership(sortedParsedImageGroups, allImageIds);

  const groupsById = new Map(sortedParsedImageGroups.map((group) => [group.id, group]));

  const topLevelGroups = topLevelGroupIds
    .map((id) => buildTree(id, groupsById, childGroupIdsByParent, imageIdsByGroup, 0))
    .filter((group): group is TreeImageGroup => group !== null);

  const treeRoot = createTreeRoot(topLevelGroups, orphanedImageIds);
  const treeRootWithTotals = applyImageTotals(treeRoot);
  const root = applyFullSlugs(treeRootWithTotals);

  return {
    item: root,
    totalCount,
    duration: performance.now() - start,
  };
};

export const updateImageGroups = async (imageGroups: SerializableImageGroup[], purge: boolean): Promise<void> => {
  const { success, data: parsedGroups, error } = z.array(SerializableImageGroupSchema).safeParse(imageGroups);
  if (success) {
    const db = await getDb();

    const tx = db.transaction('imagegroups', 'readwrite');
    const store = tx.store;

    if (purge) {
      await store.clear();
    }

    await Promise.all(parsedGroups.map((group) => store.put(group)));
    await tx.done;
  } else {
    console.error(error);
  }
};

export const deleteImageGroupsByIds = async (ids: string[]): Promise<void> => {
  const db = await getDb();

  const tx = db.transaction('imagegroups', 'readwrite');
  const store = tx.store;

  await Promise.all(ids.map((id) => store.delete(id)));
  await tx.done;
};
