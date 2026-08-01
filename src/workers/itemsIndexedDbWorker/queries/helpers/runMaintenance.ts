import { getDb, getHostApi } from '@/workers/itemsIndexedDbWorker/db';
import { startMaintenanceTasks } from '@/workers/itemsIndexedDbWorker/maintenance';

export const runMaintenance = async () => {
  const db = await getDb();
  const hostApi = await getHostApi();
  await startMaintenanceTasks(db, hostApi);
};
