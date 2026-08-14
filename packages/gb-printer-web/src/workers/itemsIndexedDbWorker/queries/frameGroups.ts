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
  const { frameGroups: repository } = await getDb();
  const start = performance.now();

  const frameGroups = await repository.getAll();
  const total = await repository.count();

  const addPaging = getAddTotal<FrameGroup>(total, start, FrameGroupSchema);

  return addPaging(frameGroups);
};

export const updateFrameGroups = async ({ frameGroups, purge }: UpdateFrameGroupsParams): Promise<void> => {
  const parsedFrameGroups = z.array(FrameGroupSchema).parse(frameGroups);
  const { frameGroups: repository } = await getDb();

  if (purge) {
    await repository.clear();
  }

  await repository.put(
    parsedFrameGroups.map((frameGroup) => ({
      key: frameGroup.id,
      value: frameGroup,
    })),
  );
};

export const deleteFrameGroupsByIds = async ({ ids }: DeleteFrameGroupsByIdsParams): Promise<void> => {
  const { frameGroups: repository } = await getDb();
  await repository.deleteByKeys(ids);
};
