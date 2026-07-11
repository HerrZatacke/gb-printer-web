import { FrameGroup } from '@/types/FrameGroup';
import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { getAddPaging } from '@/workers/itemsIndexedDbWorker/queries/queryHelpers';
import { ItemsSourceResponse } from '@/workers/itemsIndexedDbWorker/types';

export const getFrameGroups = async (): Promise<ItemsSourceResponse<FrameGroup>> => {
  const db = await getDb();
  const { store } = db.transaction('framegroups');
  const frameGroups = await store.getAll();
  const total = await store.count();

  const addPaging = getAddPaging<FrameGroup>(total, 0, frameGroups.length);

  return addPaging(frameGroups);
};
