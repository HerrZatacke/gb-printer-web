import {
  FrameSchema,
  type DeleteFramesByIdsParams,
  type Frame,
  type GetFramesByHashesParams,
  type GetFramesByIdsParams,
  type ItemsSourceTotalResponse,
  type UpdateFramesParams,
} from 'gb-printer-schemas';
import z from 'zod';
import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { getAddTotal } from '@/workers/itemsIndexedDbWorker/queries/helpers/generic';

export const getFrames = async (): Promise<ItemsSourceTotalResponse<Frame>> => {
  const { db } = await getDb();
  const start = performance.now();

  const { store } = db.transaction('frames');
  const frames = await store.getAll();
  const total = await store.count();

  const addPaging = getAddTotal<Frame>(total, start, FrameSchema);

  return addPaging(frames);
};

export const getFramesByIds = async ({ ids }: GetFramesByIdsParams): Promise<ItemsSourceTotalResponse<Frame>> => {
  const { db } = await getDb();
  const start = performance.now();

  const { store } = db.transaction('frames');
  const total = await store.count();

  const frames = await Promise.all(
    ids
      .filter(Boolean)
      .map(id => store.get(id)),
  );

  const filteredFrames = frames.filter((frame): frame is Frame => Boolean(frame));

  const addPaging = getAddTotal<Frame>(total, start, FrameSchema);

  return addPaging(filteredFrames);
};

export const getFramesByHashes = async ({ hashes }: GetFramesByHashesParams): Promise<ItemsSourceTotalResponse<Frame>> => {
  const { db } = await getDb();
  const start = performance.now();

  const { store } = db.transaction('frames');
  const total = await store.count();

  const frames = (await Promise.all(
    hashes.map(hash => store.index('hash').getAll(hash)),
  )).flat();

  const filteredFrames = frames.filter((frame): frame is Frame => Boolean(frame));

  const addPaging = getAddTotal<Frame>(total, start, FrameSchema);

  return addPaging(filteredFrames);
};

export const updateFrames = async ({ frames, purge }: UpdateFramesParams): Promise<void> => {
  const parsedFrames = z.array(FrameSchema).parse(frames);

  const { db } = await getDb();

  const tx = db.transaction('frames', 'readwrite');
  const store = tx.store;

  if (purge) {
    await store.clear();
  }

  await Promise.all(parsedFrames.map((frame) => store.put(frame)));
  await tx.done;
};

export const deleteFramesByIds = async ({ ids }: DeleteFramesByIdsParams): Promise<void> => {
  const { db } = await getDb();

  const tx = db.transaction('frames', 'readwrite');
  const store = tx.store;

  await Promise.all(ids.map((id) => store.delete(id)));
  await tx.done;
};
