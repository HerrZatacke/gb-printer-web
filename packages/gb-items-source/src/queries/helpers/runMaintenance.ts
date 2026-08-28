import { ItemsMutationReponse } from 'gb-printer-schemas';
import { startMaintenanceTasks } from '@/maintenance';
import { getMutationReponse } from '@/queries/helpers/generic';
import { type ItemsSourceInternal } from '@/types';

export async function runMaintenance(this: ItemsSourceInternal): Promise<ItemsMutationReponse> {
  const mutationReponse = getMutationReponse(performance.now());
  const invalidations = await startMaintenanceTasks(this.repositories);
  return mutationReponse(invalidations);
}
