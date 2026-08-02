import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { startMaintenanceTasks } from '@/workers/itemsIndexedDbWorker/maintenance';

export const runMaintenance = async () => {
  const db = await getDb();
  await startMaintenanceTasks(db);
};
