import {
  FrameSchema,
  type DeleteFramesByIdsParams,
  type Frame,
  type GetFramesByHashesParams,
  type GetFramesByIdsParams,
  type ItemsSourceTotalResponse,
  type UpdateFramesParams,
  type ItemsMutationReponse,
} from 'gb-printer-schemas';
import z from 'zod';
import { getAddTotal, getMutationReponse } from '@/queries/helpers/generic';
import { type ItemsSourceInternal } from '@/types';

export async function getFrames(this: ItemsSourceInternal): Promise<ItemsSourceTotalResponse<Frame>> {
  const { frames: repository } = this.repositories;
  const start = performance.now();

  const frames = await repository.getAll();
  const total = await repository.count();

  const addPaging = getAddTotal<Frame>(total, start, FrameSchema);

  return addPaging(frames);
}

export async function getFramesByIds(this: ItemsSourceInternal, { ids }: GetFramesByIdsParams): Promise<ItemsSourceTotalResponse<Frame>> {
  const { frames: repository } = this.repositories;
  const start = performance.now();

  const total = await repository.count();

  const frames = await repository.getEntriesByKeys(ids.filter(Boolean));

  const filteredFrames = frames
    .map(({ value }) => value)
    .filter((frame): frame is Frame => Boolean(frame));

  const addPaging = getAddTotal<Frame>(total, start, FrameSchema);

  return addPaging(filteredFrames);
}

export async function getFramesByHashes(this: ItemsSourceInternal, { hashes }: GetFramesByHashesParams): Promise<ItemsSourceTotalResponse<Frame>> {
  const { frames: repository } = this.repositories;
  const start = performance.now();

  const total = await repository.count();

  const frames = await repository.getByIndexValues('hash', hashes);

  const filteredFrames = frames
    .filter((frame): frame is Frame => Boolean(frame));

  const addPaging = getAddTotal<Frame>(total, start, FrameSchema);

  return addPaging(filteredFrames);
}

export async function updateFrames(this: ItemsSourceInternal, { frames, purge }: UpdateFramesParams): Promise<ItemsMutationReponse> {
  const mutationReponse = getMutationReponse(performance.now());
  const parsedFrames = z.array(FrameSchema).parse(frames);

  const { frames: repository } = this.repositories;

    if (purge) {
    await repository.clear();
  }

  await repository.put(
    parsedFrames.map((frame) => ({
      key: frame.id,
      value: frame,
    })),
  );
  return mutationReponse([]);
}

export async function deleteFramesByIds(this: ItemsSourceInternal, { ids }: DeleteFramesByIdsParams): Promise<ItemsMutationReponse> {
  const mutationReponse = getMutationReponse(performance.now());
  const { frames: repository } = this.repositories;
  await repository.deleteByKeys(ids);
  return mutationReponse([]);
}
