import { type IDBPDatabase } from 'idb';
import { type ItemsDB, type ItemsHostApi } from '@/workers/itemsIndexedDbWorker/types';

export type MaintenanceTask = (db: IDBPDatabase<ItemsDB>, hostApi: ItemsHostApi) => Promise<void>;
