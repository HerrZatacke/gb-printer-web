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
  const { frames: repository } = await getDb();
  const start = performance.now();

  const frames = await repository.getAll();
  const total = await repository.count();

  const addPaging = getAddTotal<Frame>(total, start, FrameSchema);

  return addPaging(frames);
};

export const getFramesByIds = async ({ ids }: GetFramesByIdsParams): Promise<ItemsSourceTotalResponse<Frame>> => {
  const { frames: repository } = await getDb();
  const start = performance.now();

  const total = await repository.count();

  const frames = await repository.getEntriesByKeys(ids.filter(Boolean));

  const filteredFrames = frames
    .map(({ value }) => value)
    .filter((frame): frame is Frame => Boolean(frame));

  const addPaging = getAddTotal<Frame>(total, start, FrameSchema);

  return addPaging(filteredFrames);
};

export const getFramesByHashes = async ({ hashes }: GetFramesByHashesParams): Promise<ItemsSourceTotalResponse<Frame>> => {
  const { frames: repository } = await getDb();
  const start = performance.now();

  console.log('getFramesByHashes');

  const total = await repository.count();

  const frames = await repository.getByIndexValues('hash', hashes);

  const filteredFrames = frames
    .filter((frame): frame is Frame => Boolean(frame));

  const addPaging = getAddTotal<Frame>(total, start, FrameSchema);

  return addPaging(filteredFrames);
};

export const updateFrames = async ({ frames, purge }: UpdateFramesParams): Promise<void> => {
  const parsedFrames = z.array(FrameSchema).parse(frames);

  const { frames: repository } = await getDb();

    if (purge) {
    await repository.clear();
  }

  await repository.put(
    parsedFrames.map((frame) => ({
      key: frame.id,
      value: frame,
    })),
  );
};

export const deleteFramesByIds = async ({ ids }: DeleteFramesByIdsParams): Promise<void> => {
  const { frames: repository } = await getDb();
  await repository.deleteByKeys(ids);
};
