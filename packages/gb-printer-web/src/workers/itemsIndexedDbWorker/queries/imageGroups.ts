import {
  type TreeImageGroup,
  SerializableImageGroupSchema,
  type SerializableImageGroup,
} from 'gb-printer-schemas';
import { IDBPDatabase } from 'idb';
import z from 'zod';
import sortBy from '@/tools/sortby';
import unique from '@/tools/unique';
import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { startMaintenanceTasks } from '@/workers/itemsIndexedDbWorker/maintenance';
import { applyFullSlugs } from '@/workers/itemsIndexedDbWorker/queries/helpers/applyFullSlugs';
import { applyImageTotals } from '@/workers/itemsIndexedDbWorker/queries/helpers/applyImageTotals';
import { buildTree } from '@/workers/itemsIndexedDbWorker/queries/helpers/buildTree';
import { createTreeRoot } from '@/workers/itemsIndexedDbWorker/queries/helpers/createTreeRoot';
import { getAddTotal } from '@/workers/itemsIndexedDbWorker/queries/helpers/generic';
import { resolveOwnership } from '@/workers/itemsIndexedDbWorker/queries/helpers/resolveOwnership';
import { StoredSerializableImageGroupSchema } from '@/workers/itemsIndexedDbWorker/schemas';
import {
  type DeleteImageGroupsByIdsParams,
  type ItemsDB,
  type ItemsSourceTotalResponse,
  type RootItemSourceResponse,
  type StoredSerializableImageGroup,
  type UpdateImageGroupsParams,
} from '@/workers/itemsIndexedDbWorker/types';

const sortById = sortBy<StoredSerializableImageGroup>('id');

export const getImageGroupsList = async (): Promise<ItemsSourceTotalResponse<SerializableImageGroup>> => {
  const db = await getDb();
  const start = performance.now();

  const { store } = db.transaction('imagegroups');
  const imageGroups = await store.getAll();
  const total = await store.count();

  const addPaging = getAddTotal<SerializableImageGroup>(total, start, SerializableImageGroupSchema);

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

  const parsedImageGroups = z.array(StoredSerializableImageGroupSchema).parse(imageGroups);

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

export const updateImageGroups = async ({ imageGroups, purge }: UpdateImageGroupsParams): Promise<void> => {
  const parsedGroups = z.array(StoredSerializableImageGroupSchema).parse(imageGroups);

  const db = await getDb();

  const tx = db.transaction('imagegroups', 'readwrite');
  const store = tx.store;

  if (purge) {
    await store.clear();
  }

  await Promise.all(parsedGroups.map((group) => store.put(group)));
  await tx.done;

  await startMaintenanceTasks(db);
};

const deleteImageGroupById = async (id: string, db: IDBPDatabase<ItemsDB>): Promise<void> => {
  const tx = db.transaction('imagegroups', 'readwrite');
  const store = tx.store;

  const allGroups = await store.getAll();
  const groupsById = new Map(allGroups.map((g) => [g.id, g]));
  const group = groupsById.get(id);

  if (!group) {
    await tx.done;
    return;
  }

  const { childGroupIdsByParent, imageIdsByGroup, parentByChild } = resolveOwnership(allGroups, []);
  const parentId = parentByChild.get(id) ?? null;
  const parent = parentId && groupsById.get(parentId);

  // if no parent, images/children naturally fall to root via resolveOwnership on next read
  if (parent) {
    const ownImages = imageIdsByGroup.get(id) ?? [];
    const ownChildIds = childGroupIdsByParent.get(id) ?? [];

    await store.put({
      ...parent,
      images: unique([...parent.images, ...ownImages]),
      groups: unique([...parent.groups, ...ownChildIds]),
    });
  }

  await store.delete(id);
  await tx.done;
};

export const deleteImageGroupsByIds = async ({ ids }: DeleteImageGroupsByIdsParams): Promise<void> => {
  const db = await getDb();

  for (const id of ids) {
    await deleteImageGroupById(id, db);
  }

  await startMaintenanceTasks(db);
};
