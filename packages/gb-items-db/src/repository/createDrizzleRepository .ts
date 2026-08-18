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
      count: async () => {
        console.warn(`${storeName}.count() not implemented`);
        return 0;
      },
      getAll: async () => {
        console.warn(`${storeName}.getAll() not implemented`);
        return [];
        },
      getAllKeys: async () => {
        console.warn(`${storeName}.getAllKeys() not implemented`);
        return [];
        },
      getByKey: async () => {
        console.warn(`${storeName}.getByKey() not implemented`);
        return undefined;
        },
      getEntriesByKeys: async () => {
        console.warn(`${storeName}.getEntriesByKeys() not implemented`);
        return [];
        },
      iterate: async function* () {
        console.warn(`${storeName}.iterate() not implemented`);
        return [];
        },
      put: async () => {
        console.warn(`${storeName}.put() not implemented`);
        },
      deleteByKeys: async () => {
        console.warn(`${storeName}.deleteByKeys() not implemented`);
        },
      clear: async () => {
        console.warn(`${storeName}.clear() not implemented`);
        },
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
    throw new Error(`${storeName}.getAll() not implemented`);
  };

  const getAllKeys = async (): Promise<TKey[]> => {
    throw new Error(`${storeName}.getAllKeys() not implemented`);
  };

  const getByKey = async (key: TKey): Promise<TValue | undefined> => {
    throw new Error(`${storeName}.getByKey() not implemented`);
  };

  const getEntriesByKeys = async (keys: TKey[]): Promise<RepositoryEntry<TValue, TKey>[]> => {
    const rows = await db.select().from(table).where(inArray(keyColumn, keys));

    return rows.map((row) => ({
      key: (row as Record<string, TKey>)[keyColumn.name],
      value: row as TValue,
    }));
  };

  const put = async (entries: RepositoryEntry<TValue, TKey>[]): Promise<void> => {
    const rows = entries.map((entry) => (
      hasKeyPath
        ? entry.value
        : { [keyColumn.name]: entry.key, value: entry.value }
    ));

    await Promise.all(rows.map((row) => (
      db.insert(table)
        .values(row as Record<string, unknown>)
        .onConflictDoUpdate({ target: keyColumn, set: row as Record<string, unknown> })
    )));
  };

  const deleteByKeys = async (keys: TKey[]): Promise<void> => {
    await db.delete(table).where(inArray(keyColumn, keys));
  };

  const clear = async (): Promise<void> => {
    await db.delete(table);
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
