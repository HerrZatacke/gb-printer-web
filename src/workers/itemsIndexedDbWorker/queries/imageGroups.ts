import { type SerializableImageGroup } from '@/types/ImageGroup';
import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { getAddPaging } from '@/workers/itemsIndexedDbWorker/queries/queryHelpers';
import { type ItemsSourceResponse } from '@/workers/itemsIndexedDbWorker/types';

export const getImageGroups = async (): Promise<ItemsSourceResponse<SerializableImageGroup>> => {
  const db = await getDb();
  const { store } = db.transaction('imagegroups');
  const imageGroups = await store.getAll();
  const total = await store.count();

  const addPaging = getAddPaging<SerializableImageGroup>(total, 0, imageGroups.length);

  return addPaging(imageGroups);
};
