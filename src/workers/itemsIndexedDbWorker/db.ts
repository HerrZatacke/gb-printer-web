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
  var _hostApi: ItemsHostApi | null;
  var _dbPromise: Promise<IDBPDatabase<ItemsDB>> | null;
  var _hostApiPromise: Promise<ItemsHostApi> | null;
}

global._hostApi = null;
global._dbPromise = null;
global._hostApiPromise = null;

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
  global._hostApi = configureHostApi;
};


const openAndPrepareDb = async () => {
  const start = performance.now();
  const afterUpgradeTasks: AfterUpgradeFn[] = [];
  const hostApi = await getHostApi();

  if (!hostApi) {
    throw new Error('getDb not configured');
  }

  let didUpgrade = false;

  const database = await openDB<ItemsDB>(
    'gb-printer-web--items',
    ITEMS_DB_VERSION,
    {
      async upgrade(db, oldVersion, _newVersion, tx) {
        try {
          for (let v = oldVersion; v < ITEMS_DB_VERSION; v++) {
            const task = migrationFunctions[v](db, tx);

            if (task) {
              afterUpgradeTasks.push(task);
            }
          }

          didUpgrade = true;
        } catch (error) {

          const err = new Error(`Error while upgrading indexedDB version: "${(error as Error)?.message}"`);
          hostApi.onMigrationError(err.message);
          database.close();
          throw err;
        }
      },
    },
  );

  if (didUpgrade) {
    try {
      const startUpgradeTasks = performance.now();
      for (const afterUpgradeTask of afterUpgradeTasks) {
        await afterUpgradeTask(database, hostApi);
      }
      console.log(`UpgradeTasks done in ${performance.now() - startUpgradeTasks}ms`);

      await startMaintenanceTasks(database, hostApi);
    } catch (error) {
      const err = new Error(`Error while running upgrade- or maintenance-tasks: "${(error as Error)?.message}"`);
      hostApi.onMigrationError(err.message);
      database.close();
      throw err;
    }
  }

  console.log(`openAndPrepareDb() done in ${performance.now() - start}ms`);
  return database;
};

export function getDb(): Promise<IDBPDatabase<ItemsDB>> {
  if (!global._dbPromise) {
    global._dbPromise = openAndPrepareDb().catch((err) => {
      global._dbPromise = null;
      throw err;
    });
  }
  return global._dbPromise;
}

export function getHostApi(): Promise<ItemsHostApi> {
  if (!global._hostApiPromise) {
    if (!global._hostApi) {
      throw new Error('No host api configured');
    }
    global._hostApiPromise = Promise.resolve(global._hostApi);
  }
  return global._hostApiPromise;
}
