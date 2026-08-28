import {
  FrameGroup,
  FrameGroupSchema,
  ItemStoreNames,
  type DeleteFrameGroupsByIdsParams,
  type ItemsSourceTotalResponse,
  type UpdateFrameGroupsParams,
  type ItemsMutationReponse,
} from 'gb-printer-schemas';
import z from 'zod';
import { getAddTotal, getMutationReponse } from '@/queries/helpers/generic';
import { type ItemsSourceInternal } from '@/types';


export async function getFrameGroups(this: ItemsSourceInternal): Promise<ItemsSourceTotalResponse<FrameGroup>> {
  const { framegroups: repository } = this.repositories;
  const start = performance.now();

  const frameGroups = await repository.getAll();
  const total = await repository.count();

  const addPaging = getAddTotal<FrameGroup>(total, start, FrameGroupSchema);

  return addPaging(frameGroups);
}

export async function updateFrameGroups(this: ItemsSourceInternal, { frameGroups, purge }: UpdateFrameGroupsParams): Promise<ItemsMutationReponse> {
  const mutationReponse = getMutationReponse(performance.now());
  const parsedFrameGroups = z.array(FrameGroupSchema).parse(frameGroups);
  const { framegroups: repository } = this.repositories;

  if (purge) {
    await repository.clear();
  }

  await repository.put(
    parsedFrameGroups.map((frameGroup) => ({
      key: frameGroup.id,
      value: frameGroup,
    })),
  );
  return mutationReponse([{ collection: ItemStoreNames.FRAMEGROUPS }]);
}

export async function deleteFrameGroupsByIds(this: ItemsSourceInternal, { ids }: DeleteFrameGroupsByIdsParams): Promise<ItemsMutationReponse> {
  const mutationReponse = getMutationReponse(performance.now());
  const { framegroups: repository } = this.repositories;
  await repository.deleteByKeys(ids);
  return mutationReponse([{ collection: ItemStoreNames.FRAMEGROUPS }]);
}
