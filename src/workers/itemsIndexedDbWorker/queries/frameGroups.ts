import z from 'zod';
import { FrameGroup, FrameGroupSchema } from '@/types/FrameGroup';
import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { getAddPaging } from '@/workers/itemsIndexedDbWorker/queries/helpers/generic';
import { type ItemsSourceResponse } from '@/workers/itemsIndexedDbWorker/types';

export const getFrameGroups = async (): Promise<ItemsSourceResponse<FrameGroup>> => {
  const db = await getDb();
  const start = performance.now();

  const { store } = db.transaction('framegroups');
  const frameGroups = await store.getAll();
  const total = await store.count();

  const addPaging = getAddPaging<FrameGroup>(total, 0, frameGroups.length, start, FrameGroupSchema);

  return addPaging(frameGroups);
};

export const updateFrameGroups = async (frameGroups: FrameGroup[]): Promise<void> => {
  const { success, data: parsedFrameGroups, error } = z.array(FrameGroupSchema).safeParse(frameGroups);
  if (success) {
    const db = await getDb();

    const tx = db.transaction('framegroups', 'readwrite');
    const store = tx.store;

    await Promise.all(parsedFrameGroups.map((frameGroup) => store.put(frameGroup)));
    await tx.done;
  } else {
    console.error(error);
  }
};

export const deleteFrameGroupsByIds = async (ids: string[]): Promise<void> => {
  const db = await getDb();

  const tx = db.transaction('framegroups', 'readwrite');
  const store = tx.store;

  await Promise.all(ids.map((id) => store.delete(id)));
  await tx.done;
};
