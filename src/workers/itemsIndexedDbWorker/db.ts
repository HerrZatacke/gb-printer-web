import { type IDBPDatabase, openDB, deleteDB } from 'idb';
import { migrateV1 } from '@/workers/itemsIndexedDbWorker/migrations/v1';
import {
  type AfterUpgradeFn,
  type ItemsDB,
  type ItemsHostApi,
  type MigrationFn,
} from '@/workers/itemsIndexedDbWorker/types';

const migrationFunctions: MigrationFn[] = [
  migrateV1, // migrate v0 -> v1
  // Pattern for future migrations:
  // migrateV2, // migrate v1 -> v2
  // migrateV3, // migrate v2 -> v3
  // migrateV4, // migrate v3 -> v4
];

let hostApi: ItemsHostApi | null = null;
let dbPromise: Promise<IDBPDatabase<ItemsDB>> | null = null;
let hostApiPromise: Promise<ItemsHostApi> | null = null;

export const configureDb = (configureHostApi: ItemsHostApi): void => {
  hostApi = configureHostApi;
};


const openAndPrepareDb = async () => {
  const p = performance.now();
  const afterUpgradeTasks: AfterUpgradeFn[] = [];

  if (!hostApi) {
    throw new Error('getDb not configured');
  }

  if (location.hostname === 'localhost') {
    await deleteDB('gb-printer-web--items');
  }

  const database = await openDB<ItemsDB>(
    'gb-printer-web--items',
    migrationFunctions.length,
    {
      async upgrade(db, oldVersion, _newVersion, tx) {

        for (let v = oldVersion; v < migrationFunctions.length; v++) {
          const task = migrationFunctions[v](db, tx);

          if (task) {
            afterUpgradeTasks.push(task);
          }
        }
      },
    },
  );

  for (const afterUpgradeTask of afterUpgradeTasks) {
    await afterUpgradeTask(database, hostApi);
  }

  console.log(`openAndPrepareDb() done in ${performance.now() - p}ms`);
  return database;
};

export function getDb(): Promise<IDBPDatabase<ItemsDB>> {
  if (!dbPromise) {
    dbPromise = openAndPrepareDb().catch((err) => {
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
}

export function getHostApi(): Promise<ItemsHostApi> {
  if (!hostApiPromise) {
    if (!hostApi) {
      throw new Error('No host api configured');
    }
    hostApiPromise = Promise.resolve(hostApi);
  }
  return hostApiPromise;
}
