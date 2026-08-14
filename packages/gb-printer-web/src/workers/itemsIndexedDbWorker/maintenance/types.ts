import { PreparedDb } from '@/workers/itemsIndexedDbWorker/db';

export type MaintenanceTask = (repositories: PreparedDb) => Promise<void>;
