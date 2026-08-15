import {
  FrameGroup,
  FrameGroupSchema,
  type DeleteFrameGroupsByIdsParams,
  type ItemsSourceTotalResponse,
  type UpdateFrameGroupsParams,
} from 'gb-printer-schemas';
import z from 'zod';
import { getAddTotal } from '@/queries/helpers/generic';
import { type ItemsSourceInternal } from '@/types';


export async function getFrameGroups(this: ItemsSourceInternal): Promise<ItemsSourceTotalResponse<FrameGroup>> {
  const { frameGroups: repository } = this.repositories;
  const start = performance.now();

  const frameGroups = await repository.getAll();
  const total = await repository.count();

  const addPaging = getAddTotal<FrameGroup>(total, start, FrameGroupSchema);

  return addPaging(frameGroups);
}

export async function updateFrameGroups(this: ItemsSourceInternal, { frameGroups, purge }: UpdateFrameGroupsParams): Promise<void> {
  const parsedFrameGroups = z.array(FrameGroupSchema).parse(frameGroups);
  const { frameGroups: repository } = this.repositories;

  if (purge) {
    await repository.clear();
  }

  await repository.put(
    parsedFrameGroups.map((frameGroup) => ({
      key: frameGroup.id,
      value: frameGroup,
    })),
  );
}

export async function deleteFrameGroupsByIds(this: ItemsSourceInternal, { ids }: DeleteFrameGroupsByIdsParams): Promise<void> {
  const { frameGroups: repository } = this.repositories;
  await repository.deleteByKeys(ids);
}
