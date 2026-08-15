import { populateGroupAggregates } from '@/maintenance/populateGroupAggregates';
import { reconcileImageGroups } from '@/maintenance/reconcileImageGroups';
import { MaintenanceTask } from '@/maintenance/types';
import { type Repositories } from '@/types';

const maintenanceTasks: MaintenanceTask[] = [
  populateGroupAggregates,
  reconcileImageGroups,
];

export const startMaintenanceTasks = async (repositories: Repositories): Promise<void> => {
  const start = performance.now();
  for (const maintenanceTask of maintenanceTasks) {
    await maintenanceTask(repositories);
  }
  console.log(`MaintenanceTasks done in ${Math.round(performance.now() - start)}ms`);
};
