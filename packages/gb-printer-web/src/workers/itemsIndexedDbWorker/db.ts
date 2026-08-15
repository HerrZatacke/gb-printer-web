import { type IDBPDatabase, openDB } from 'idb';
import { ITEMS_DB_VERSION } from '@/stores/constants';
import { startMaintenanceTasks } from '@/workers/itemsIndexedDbWorker/maintenance';
import { migrateV1 } from '@/workers/itemsIndexedDbWorker/migrations/v1';
import { createRepositories, type Repositories } from '@/workers/itemsIndexedDbWorker/repository/entities';
import {
  type AfterUpgradeFn,
  type ItemsDB,
  type ItemsHostApi,
  type MigrationFn,
} from '@/workers/itemsIndexedDbWorker/types';

export interface PreparedDb extends Repositories {
  db: IDBPDatabase<ItemsDB>;
}

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

export const openAndPrepareDb = async (hostApi: ItemsHostApi): Promise<PreparedDb> => {
  const start = performance.now();
  const afterUpgradeTasks: AfterUpgradeFn[] = [];

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

  const repositories = createRepositories(database);

  const preparedDb = {
    db: database,
    ...repositories,
  };

  if (didUpgrade) {
    try {
      const startUpgradeTasks = performance.now();
      for (const afterUpgradeTask of afterUpgradeTasks) {
        await afterUpgradeTask(database, hostApi);
      }
      console.log(`UpgradeTasks done in ${performance.now() - startUpgradeTasks}ms`);

      await startMaintenanceTasks(preparedDb);
    } catch (error) {
      const err = new Error(`Error while running upgrade- or maintenance-tasks: "${(error as Error)?.message}"`);
      hostApi.onMigrationError(err.message);
      database.close();
      throw err;
    }
  }

  console.log(`openAndPrepareDb() done in ${performance.now() - start}ms`);
  return preparedDb;
};
