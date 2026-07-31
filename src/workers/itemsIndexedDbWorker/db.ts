import { type IDBPDatabase, openDB } from 'idb';
import { ITEMS_DB_VERSION } from '@/stores/constants';
import { startMaintenanceTasks } from '@/workers/itemsIndexedDbWorker/maintenance';
import { migrateV1 } from '@/workers/itemsIndexedDbWorker/migrations/v1';
import {
  type AfterUpgradeFn,
  type ItemsDB,
  type ItemsHostApi,
  type MigrationFn,
} from '@/workers/itemsIndexedDbWorker/types';

declare global {
  var hostApi: ItemsHostApi | null;
  var dbPromise: Promise<IDBPDatabase<ItemsDB>> | null;
  var hostApiPromise: Promise<ItemsHostApi> | null;
}

global.hostApi = null;
global.dbPromise = null;
global.hostApiPromise = null;

const migrationFunctions: MigrationFn[] = [
  migrateV1, // migrate v0 -> v1
  // Pattern for future migrations:
  // migrateV2, // migrate v1 -> v2
  // migrateV3, // migrate v2 -> v3
  // migrateV4, // migrate v3 -> v4
];

if (ITEMS_DB_VERSION !== migrationFunctions.length) {
  throw new Error('ITEMS_DB_VERSION version mismatch!');
}

export const configureDb = (configureHostApi: ItemsHostApi): void => {
  global.hostApi = configureHostApi;
};


const openAndPrepareDb = async () => {
  const start = performance.now();
  const afterUpgradeTasks: AfterUpgradeFn[] = [];

  if (!global.hostApi) {
    throw new Error('getDb not configured');
  }

  let didUpgrade = false;

  const database = await openDB<ItemsDB>(
    'gb-printer-web--items',
    ITEMS_DB_VERSION,
    {
      async upgrade(db, oldVersion, _newVersion, tx) {

        for (let v = oldVersion; v < ITEMS_DB_VERSION; v++) {
          const task = migrationFunctions[v](db, tx);

          if (task) {
            afterUpgradeTasks.push(task);
          }
        }

        didUpgrade = true;
      },
    },
  );

  if (didUpgrade) {
    const startUpgradeTasks = performance.now();
    for (const afterUpgradeTask of afterUpgradeTasks) {
      await afterUpgradeTask(database, global.hostApi);
    }
    console.log(`UpgradeTasks done in ${performance.now() - startUpgradeTasks}ms`);

    await startMaintenanceTasks(database, global.hostApi);
  }

  console.log(`openAndPrepareDb() done in ${performance.now() - start}ms`);
  return database;
};

export function getDb(): Promise<IDBPDatabase<ItemsDB>> {
  if (!global.dbPromise) {
    global.dbPromise = openAndPrepareDb().catch((err) => {
      global.dbPromise = null;
      throw err;
    });
  }
  return global.dbPromise;
}

export function getHostApi(): Promise<ItemsHostApi> {
  if (!hostApiPromise) {
    if (!global.hostApi) {
      throw new Error('No host api configured');
    }
    hostApiPromise = Promise.resolve(global.hostApi);
  }
  return hostApiPromise;
}
