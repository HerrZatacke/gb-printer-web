import { Repositories } from '@/workers/itemsIndexedDbWorker/repository/entities';

export type MaintenanceTask = (repositories: Repositories) => Promise<void>;
