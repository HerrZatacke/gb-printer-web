import { type IDBPDatabase } from 'idb';
import { populateGroupAggregates } from '@/workers/itemsIndexedDbWorker/maintenance/populateGroupAggregates';
import { reconcileImageGroups } from '@/workers/itemsIndexedDbWorker/maintenance/reconcileImageGroups';
import { MaintenanceTask } from '@/workers/itemsIndexedDbWorker/maintenance/types';
import { type ItemsDB } from '@/workers/itemsIndexedDbWorker/types';

const maintenanceTasks: MaintenanceTask[] = [
  populateGroupAggregates,
  reconcileImageGroups,
];

export const startMaintenanceTasks = async (db: IDBPDatabase<ItemsDB>): Promise<void> => {
  const start = performance.now();
  for (const maintenanceTask of maintenanceTasks) {
    await maintenanceTask(db);
  }
  console.log(`MaintenanceTasks done in ${Math.round(performance.now() - start)}ms`);
};
