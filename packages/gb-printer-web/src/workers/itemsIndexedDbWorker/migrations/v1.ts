import { type IDBPDatabase } from 'idb';
import { type AfterUpgradeFn, type ItemsDB, type MigrationFn } from '@/workers/itemsIndexedDbWorker/types';
import { v1LegacyData } from './v1LegacyData';

export const migrateV1: MigrationFn = (db: IDBPDatabase<ItemsDB>): AfterUpgradeFn => {
  const framesStore = db.createObjectStore('frames', { keyPath: 'id' });
  framesStore.createIndex('hash', 'hash');

  const imagesStore = db.createObjectStore('images', { keyPath: 'hash' });
  imagesStore.createIndex('tags', 'tags', { multiEntry: true });
  imagesStore.createIndex('referencedHashes', 'referencedHashes', { multiEntry: true });

  db.createObjectStore('palettes', { keyPath: 'shortName' });
  db.createObjectStore('framegroups', { keyPath: 'id' });
  db.createObjectStore('imagegroups', { keyPath: 'id' });
  db.createObjectStore('plugins', { keyPath: 'url' });

  db.createObjectStore('binaryframes');
  db.createObjectStore('binaryimages');

  return v1LegacyData;
};
