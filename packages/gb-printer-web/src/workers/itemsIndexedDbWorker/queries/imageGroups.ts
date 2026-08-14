import {
  SerializableImageGroupSchema,
  StoredSerializableImageGroupSchema,
  type DeleteImageGroupsByIdsParams,
  type ItemsSourceTotalResponse,
  type RootItemSourceResponse,
  type SerializableImageGroup,
  type StoredSerializableImageGroup,
  type TreeImageGroup,
  type UpdateImageGroupsParams,
} from 'gb-printer-schemas';
import z from 'zod';
import sortBy from '@/tools/sortby';
import unique from '@/tools/unique';
import { getDb, PreparedDb } from '@/workers/itemsIndexedDbWorker/db';
import { startMaintenanceTasks } from '@/workers/itemsIndexedDbWorker/maintenance';
import { applyFullSlugs } from '@/workers/itemsIndexedDbWorker/queries/helpers/applyFullSlugs';
import { applyImageTotals } from '@/workers/itemsIndexedDbWorker/queries/helpers/applyImageTotals';
import { buildTree } from '@/workers/itemsIndexedDbWorker/queries/helpers/buildTree';
import { createTreeRoot } from '@/workers/itemsIndexedDbWorker/queries/helpers/createTreeRoot';
import { getAddTotal } from '@/workers/itemsIndexedDbWorker/queries/helpers/generic';
import { resolveOwnership } from '@/workers/itemsIndexedDbWorker/queries/helpers/resolveOwnership';

const sortById = sortBy<StoredSerializableImageGroup>('id');

export const getImageGroupsList = async (): Promise<ItemsSourceTotalResponse<SerializableImageGroup>> => {
  const { imageGroups: repository } = await getDb();
  const start = performance.now();

  const imageGroups = await repository.getAll();
  const total = await repository.count();

  const addPaging = getAddTotal<SerializableImageGroup>(total, start, SerializableImageGroupSchema);

  return addPaging(imageGroups);
};

export const getImageGroupsFullTree = async (): Promise<RootItemSourceResponse<TreeImageGroup>> => {
  const repositories = await getDb();
  const start = performance.now();

  const [imageGroups, totalCount, allImageIds] = await Promise.all([
    repositories.imageGroups.getAll(),
    repositories.imageGroups.count(),
    repositories.images.getAllKeys(),
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

  const { imageGroups: repository } = await getDb();

  if (purge) {
    await repository.clear();
  }

  repository.put(
    parsedGroups.map((group) => ({
      key: group.id,
      value: group,
    })),
  );

  await startMaintenanceTasks();
};

const deleteImageGroupById = async (id: string, repositories: PreparedDb): Promise<void> => {
  const { imageGroups: repository } = repositories;

  const allGroups = await repository.getAll();
  const groupsById = new Map(allGroups.map((g) => [g.id, g]));
  const group = groupsById.get(id);

  if (!group) {
    return;
  }

  const { childGroupIdsByParent, imageIdsByGroup, parentByChild } = resolveOwnership(allGroups, []);
  const parentId = parentByChild.get(id) ?? null;
  const parent = parentId && groupsById.get(parentId);

  // if no parent, images/children naturally fall to root via resolveOwnership on next read
  if (parent) {
    const ownImages = imageIdsByGroup.get(id) ?? [];
    const ownChildIds = childGroupIdsByParent.get(id) ?? [];

    await repository.put([{
      key: parent.id,
      value: {
        ...parent,
        images: unique([...parent.images, ...ownImages]),
        groups: unique([...parent.groups, ...ownChildIds]),
      },
    }]);
  }

  await repository.deleteByKeys([id]);
};

export const deleteImageGroupsByIds = async ({ ids }: DeleteImageGroupsByIdsParams): Promise<void> => {
  const repositories = await getDb();

  for (const id of ids) {
    await deleteImageGroupById(id, repositories);
  }

  await startMaintenanceTasks();
};
