import { type IDBPDatabase, openDB, deleteDB } from 'idb';
import { populateGroupAggregatedTags } from '@/workers/itemsIndexedDbWorker/maintenance/populateGroupAggregatedTags';
import { pruneAndRepairImageGroups } from '@/workers/itemsIndexedDbWorker/maintenance/pruneAndRepairImageGroups';
import { MaintenanceTask } from '@/workers/itemsIndexedDbWorker/maintenance/types';
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

export const configureDb = (configureHostApi: ItemsHostApi): void => {
  global.hostApi = configureHostApi;
};


const openAndPrepareDb = async () => {
  const start = performance.now();
  const afterUpgradeTasks: AfterUpgradeFn[] = [];

  if (!global.hostApi) {
    throw new Error('getDb not configured');
  }

  // if (location.hostname === 'localhost') {
  //   await deleteDB('gb-printer-web--items');
  // }

  let didUpgrade = false;

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

    const maintenanceTasks: MaintenanceTask[] = [
      populateGroupAggregatedTags,
      pruneAndRepairImageGroups,
    ];

    const startMaintenanceTasks = performance.now();
    for (const maintenanceTask of maintenanceTasks) {
      await maintenanceTask(database, global.hostApi);
    }
    console.log(`MaintenanceTasks done in ${performance.now() - startMaintenanceTasks}ms`);
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
