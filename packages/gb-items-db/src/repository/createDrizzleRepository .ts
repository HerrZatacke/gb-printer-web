/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  count as countFn,
  inArray,
} from 'drizzle-orm';
import { type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import {
  getTableConfig,
  type SQLiteTable,
} from 'drizzle-orm/sqlite-core';
import {
  StoreNames,
  type EntityConfig,
  type IndexedItemRepository,
  type ItemRepository,
  type RepositoryEntry,
} from 'gb-items-source';
import { images } from '@/db/schema';

const tableByStoreName: Record<StoreNames, SQLiteTable | null> = {
  [StoreNames.IMAGES]: images,
  [StoreNames.FRAMES]: null,
  [StoreNames.FRAMEGROUPS]: null,
  [StoreNames.IMAGEGROUPS]: null,
  [StoreNames.PALETTES]: null,
  [StoreNames.PLUGINS]: null,
  [StoreNames.BINARYIMAGES]: null,
  [StoreNames.BINARYFRAMES]: null,
};

export const createDrizzleRepository = <TValue, TKey extends string = string>(
  db: BetterSQLite3Database,
  config: EntityConfig<TValue, TKey>,
): ItemRepository<TValue, TKey> => {
  const { storeName, hasKeyPath } = config;
  const table = tableByStoreName[storeName];

  if (!table) {
    // ToDo: throw once all regular tables are implemented
    return {
      count: async () => 0,
      getAll: async () => {throw new Error('not implemented');},
      getAllKeys: async () => {throw new Error('not implemented');},
      getByKey: async () => {throw new Error('not implemented');},
      getEntriesByKeys: async () => {throw new Error('not implemented');},
      iterate: async function* () {throw new Error('not implemented');},
      put: async () => {throw new Error('not implemented');},
      deleteByKeys: async () => {throw new Error('not implemented');},
      clear: async () => {throw new Error('not implemented');},
    };
  }

  const tableConfig = getTableConfig(table);
  const keyColumn = tableConfig.primaryKeys[0]?.columns[0]
    ?? tableConfig.columns.find((column) => column.primary);

  if (!keyColumn) {
    throw new Error(`No primary key column found for store: ${storeName}`);
  }

  const count = async (): Promise<number> => {
    const [result] = await db.select({ value: countFn() }).from(table);
    return result.value;
  };

  const getAll = async (): Promise<TValue[]> => {
    throw new Error('not implemented');
  };

  const getAllKeys = async (): Promise<TKey[]> => {
    throw new Error('not implemented');
  };

  const getByKey = async (key: TKey): Promise<TValue | undefined> => {
    throw new Error('not implemented');
  };

  const getEntriesByKeys = async (keys: TKey[]): Promise<RepositoryEntry<TValue, TKey>[]> => {
    const rows = await db.select().from(table).where(inArray(keyColumn, keys));

    return rows.map((row) => ({
      key: (row as Record<string, TKey>)[keyColumn.name],
      value: row as TValue,
    }));
  };

  const put = async (entries: RepositoryEntry<TValue, TKey>[]): Promise<void> => {
    throw new Error('not implemented');
  };

  const deleteByKeys = async (keys: TKey[]): Promise<void> => {
    throw new Error('not implemented');
  };

  const clear = async (): Promise<void> => {
    throw new Error('not implemented');
  };

  const iterate = async function* (): AsyncGenerator<TValue> {
    const pageSize = 200;
    let offset = 0;

    while (true) {
      const rows = await db.select().from(table).limit(pageSize).offset(offset);
      if (rows.length === 0) {
        break;
      }

      for (const row of rows) {
        yield row as TValue;
      }

      offset += pageSize;
    }
  };

  return {
    count,
    getAll,
    getAllKeys,
    getByKey,
    getEntriesByKeys,
    iterate,
    put,
    deleteByKeys,
    clear,
  };
};

export const createIndexedDrizzleRepository = <TValue, TKey extends string = string>(
  db: BetterSQLite3Database,
  config: EntityConfig<TValue, TKey>,
): IndexedItemRepository<TValue, TKey> => {
  const base = createDrizzleRepository(db, config);

  const getByIndexValues = async (indexName: string, values: string[]): Promise<TValue[]> => {
    throw new Error('not implemented');
  };

  const getDistinctIndexValues = async (indexName: string): Promise<string[]> => {
    throw new Error('not implemented');
  };

  return {
    ...base,
    getByIndexValues,
    getDistinctIndexValues,
  };
};
