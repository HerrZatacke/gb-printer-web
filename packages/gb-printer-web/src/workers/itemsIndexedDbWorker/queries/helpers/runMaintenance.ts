import { startMaintenanceTasks } from '@/workers/itemsIndexedDbWorker/maintenance';

export const runMaintenance = async () => {
  await startMaintenanceTasks();
};
