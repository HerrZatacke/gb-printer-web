import z from 'zod';
import { type Frame, FrameSchema } from '@/types/Frame';
import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { getAddPaging } from '@/workers/itemsIndexedDbWorker/queries/helpers/generic';
import { type ItemsSourceResponse } from '@/workers/itemsIndexedDbWorker/types';

export const getFrames = async (): Promise<ItemsSourceResponse<Frame>> => {
  const db = await getDb();
  const start = performance.now();

  const { store } = db.transaction('frames');
  const frames = await store.getAll();
  const total = await store.count();

  const addPaging = getAddPaging<Frame>(total, 0, frames.length, start, FrameSchema);

  return addPaging(frames);
};

export const getFramesByIds = async (ids: string[]): Promise<ItemsSourceResponse<Frame>> => {
  const db = await getDb();
  const start = performance.now();

  const { store } = db.transaction('frames');
  const total = await store.count();

  const frames = await Promise.all(
    ids.map(id => store.get(id)),
  );

  const filteredFrames = frames.filter((frame): frame is Frame => Boolean(frame));

  const addPaging = getAddPaging<Frame>(total, 0, frames.length, start, FrameSchema);

  return addPaging(filteredFrames);
};

export const getFramesByHashes = async (hashes: string[]): Promise<ItemsSourceResponse<Frame>> => {
  const db = await getDb();
  const start = performance.now();

  const { store } = db.transaction('frames');
  const total = await store.count();

  const frames = (await Promise.all(
    hashes.map(hash => store.index('hash').getAll(hash)),
  )).flat();

  const filteredFrames = frames.filter((frame): frame is Frame => Boolean(frame));

  const addPaging = getAddPaging<Frame>(total, 0, frames.length, start, FrameSchema);

  return addPaging(filteredFrames);
};

export const updateFrames = async (frames: Frame[]): Promise<void> => {
  const { success, data: parsedFrames, error } = z.array(FrameSchema).safeParse(frames);

  if (success) {
    const db = await getDb();

    const tx = db.transaction('frames', 'readwrite');
    const store = tx.store;

    await Promise.all(parsedFrames.map((frame) => store.put(frame)));
    await tx.done;
  } else {
    console.error(error);
  }
};

export const deleteFramesByIds = async (ids: string[]): Promise<void> => {
  const db = await getDb();

  const tx = db.transaction('frames', 'readwrite');
  const store = tx.store;

  await Promise.all(ids.map((id) => store.delete(id)));
  await tx.done;
};
