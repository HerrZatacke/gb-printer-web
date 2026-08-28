import { type ItemsInvalidation } from 'gb-printer-schemas';
import { populateGroupAggregates } from '@/maintenance/populateGroupAggregates';
import { reconcileImageGroups } from '@/maintenance/reconcileImageGroups';
import { MaintenanceTask } from '@/maintenance/types';
import { type Repositories } from '@/types';

const maintenanceTasks: MaintenanceTask[] = [
  populateGroupAggregates,
  reconcileImageGroups,
];

export const startMaintenanceTasks = async (repositories: Repositories): Promise<ItemsInvalidation[]> => {
  const start = performance.now();
  const invalidations: ItemsInvalidation[] = [];

  for (const maintenanceTask of maintenanceTasks) {
    invalidations.push(...(await maintenanceTask(repositories)));
  }

  console.log(`MaintenanceTasks done in ${Math.round(performance.now() - start)}ms`);

  return invalidations;
};
