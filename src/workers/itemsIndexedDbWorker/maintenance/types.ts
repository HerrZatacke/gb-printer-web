import { type IDBPDatabase } from 'idb';
import { type ItemsDB } from '@/workers/itemsIndexedDbWorker/types';

export type MaintenanceTask = (db: IDBPDatabase<ItemsDB>) => Promise<void>;
