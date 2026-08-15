import { startMaintenanceTasks } from '@/workers/itemsIndexedDbWorker/maintenance';
import { type ItemsSourceInternal } from '@/workers/itemsIndexedDbWorker/types';

export async function runMaintenance(this: ItemsSourceInternal) {
  await startMaintenanceTasks(this.db);
}
