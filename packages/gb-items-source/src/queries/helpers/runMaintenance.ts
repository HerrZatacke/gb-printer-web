import { startMaintenanceTasks } from '@/maintenance';
import { type ItemsSourceInternal } from '@/types';

export async function runMaintenance(this: ItemsSourceInternal) {
  await startMaintenanceTasks(this.repositories);
}
