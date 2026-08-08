import {
  FrameGroup,
  FrameGroupSchema,
  type DeleteFrameGroupsByIdsParams,
  type ItemsSourceTotalResponse,
  type UpdateFrameGroupsParams,
} from 'gb-printer-schemas';
import z from 'zod';
import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { getAddTotal } from '@/workers/itemsIndexedDbWorker/queries/helpers/generic';


export const getFrameGroups = async (): Promise<ItemsSourceTotalResponse<FrameGroup>> => {
  const db = await getDb();
  const start = performance.now();

  const { store } = db.transaction('framegroups');
  const frameGroups = await store.getAll();
  const total = await store.count();

  const addPaging = getAddTotal<FrameGroup>(total, start, FrameGroupSchema);

  return addPaging(frameGroups);
};

export const updateFrameGroups = async ({ frameGroups, purge }: UpdateFrameGroupsParams): Promise<void> => {
  const parsedFrameGroups = z.array(FrameGroupSchema).parse(frameGroups);
  const db = await getDb();

  const tx = db.transaction('framegroups', 'readwrite');
  const store = tx.store;

  if (purge) {
    await store.clear();
  }

  await Promise.all(parsedFrameGroups.map((frameGroup) => store.put(frameGroup)));
  await tx.done;
};

export const deleteFrameGroupsByIds = async ({ ids }: DeleteFrameGroupsByIdsParams): Promise<void> => {
  const db = await getDb();

  const tx = db.transaction('framegroups', 'readwrite');
  const store = tx.store;

  await Promise.all(ids.map((id) => store.delete(id)));
  await tx.done;
};
