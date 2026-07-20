import { IDBPDatabase } from 'idb';
import { ItemsDB, ItemsHostApi } from '@/workers/itemsIndexedDbWorker/types';

export type MaintenanceTask = (db: IDBPDatabase<ItemsDB>, hostApi: ItemsHostApi) => Promise<void>;
