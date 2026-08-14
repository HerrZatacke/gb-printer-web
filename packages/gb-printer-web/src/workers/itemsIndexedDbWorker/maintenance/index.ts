import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { populateGroupAggregates } from '@/workers/itemsIndexedDbWorker/maintenance/populateGroupAggregates';
import { reconcileImageGroups } from '@/workers/itemsIndexedDbWorker/maintenance/reconcileImageGroups';
import { MaintenanceTask } from '@/workers/itemsIndexedDbWorker/maintenance/types';

const maintenanceTasks: MaintenanceTask[] = [
  populateGroupAggregates,
  reconcileImageGroups,
];

export const startMaintenanceTasks = async (): Promise<void> => {
  const repositories = await getDb();
  const start = performance.now();
  for (const maintenanceTask of maintenanceTasks) {
    await maintenanceTask(repositories);
  }
  console.log(`MaintenanceTasks done in ${Math.round(performance.now() - start)}ms`);
};
