import { type IDBPDatabase } from 'idb';
import { populateGroupAggregatedTags } from '@/workers/itemsIndexedDbWorker/maintenance/populateGroupAggregatedTags';
import { pruneAndRepairImageGroups } from '@/workers/itemsIndexedDbWorker/maintenance/pruneAndRepairImageGroups';
import { MaintenanceTask } from '@/workers/itemsIndexedDbWorker/maintenance/types';
import { type ItemsDB, type ItemsHostApi } from '@/workers/itemsIndexedDbWorker/types';

const maintenanceTasks: MaintenanceTask[] = [
  populateGroupAggregatedTags,
  pruneAndRepairImageGroups,
];

export const startMaintenanceTasks = async (db: IDBPDatabase<ItemsDB>, hostApi: ItemsHostApi): Promise<void> => {
  const start = performance.now();
  for (const maintenanceTask of maintenanceTasks) {
    await maintenanceTask(db, hostApi);
  }
  console.log(`MaintenanceTasks done in ${Math.round(performance.now() - start)}ms`);
};
