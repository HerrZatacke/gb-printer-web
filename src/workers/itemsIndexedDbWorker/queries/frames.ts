import  { type Frame } from '@/types/Frame';
import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { getAddPaging } from '@/workers/itemsIndexedDbWorker/queries/queryHelpers';
import { ItemsSourceResponse } from '@/workers/itemsIndexedDbWorker/types';

export const getFrames = async (): Promise<ItemsSourceResponse<Frame>> => {
  const db = await getDb();
  const { store } = db.transaction('frames');
  const frames = await store.getAll();
  const total = await store.count();

  const addPaging = getAddPaging<Frame>(total, 0, frames.length);

  return addPaging(frames);
};

export const getFramesByIds = async (ids: string[]): Promise<ItemsSourceResponse<Frame>> => {
  const db = await getDb();
  const { store } = db.transaction('frames');
  const total = await store.count();

  const frames = await Promise.all(
    ids.map(id => store.get(id)),
  );

  const filteredFrames = frames.filter((frame): frame is Frame => Boolean(frame));

  const addPaging = getAddPaging<Frame>(total, 0, frames.length);

  return addPaging(filteredFrames);
};
