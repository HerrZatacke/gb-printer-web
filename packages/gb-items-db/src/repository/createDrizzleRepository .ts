import {
  count as countFn,
  inArray,
  eq,
} from 'drizzle-orm';
import { type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import {
  getTableConfig,
  type SQLiteColumn,
} from 'drizzle-orm/sqlite-core';
import {
  type EntityConfig,
  type IndexedItemRepository,
  type ItemRepository,
  type RepositoryEntry,
} from 'gb-items-source';
import { IndexDefinition, indexesByStoreName, WithColumns } from '@/repository/indexesByStoreName';
import { tableByStoreName } from '@/repository/tablesByStoreName';

export const createDrizzleRepository = <TValue, TKey extends string = string>(
  db: BetterSQLite3Database,
  config: EntityConfig<TValue, TKey>,
): ItemRepository<TValue, TKey> => {
  const { storeName, hasKeyPath } = config;
  const table = tableByStoreName[storeName];

  if (!table) {
    throw new Error(`Found no table for ${storeName}`);
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
    const rows = await db.select().from(table);
    return rows as TValue[];
  };

  const getAllKeys = async (): Promise<TKey[]> => {
    const rows = await db.select({ key: keyColumn }).from(table);
    return rows.map((row) => row.key as TKey);
  };

  const getByKey = async (key: TKey): Promise<TValue | undefined> => {
    const [row] = await db.select().from(table).where(eq(keyColumn, key));
    return row as TValue | undefined;
  };

  const getEntriesByKeys = async (keys: TKey[]): Promise<RepositoryEntry<TValue, TKey>[]> => {
    const rows = await db.select().from(table).where(inArray(keyColumn, keys));

    console.log(JSON.stringify({ rows }, null, 2));

    if (!hasKeyPath) {
      return rows as RepositoryEntry<TValue, TKey>[];
    }

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
  const { storeName, keyOf } = config;
  const table = tableByStoreName[storeName];

  if (!table) {
    throw new Error(`Found no table for ${storeName}`);
  }

  if (!keyOf) {
    throw new Error(`Indexed repository ${storeName} needs keyOf method in config`);
  }

  const getIndexDefinition = (indexName: string): IndexDefinition & WithColumns=> {
    const indexDef = indexesByStoreName[storeName]?.[indexName];

    if (!indexDef) {
      throw new Error(`No index "${indexName}" defined for store: ${storeName}`);
    }

    return {
      ...indexDef,
      ownerColumn: (indexDef.indexTable as unknown as Record<string, SQLiteColumn>)[indexDef.ownerFieldName],
      valueColumn: (indexDef.indexTable as unknown as Record<string, SQLiteColumn>)[indexDef.valueFieldName],
    };
  };

  const tableConfig = getTableConfig(table);
  const keyColumn = tableConfig.primaryKeys[0]?.columns[0]
    ?? tableConfig.columns.find((column) => column.primary);

  const getByIndexValues = async (indexName: string, values: string[]): Promise<TValue[]> => {
    const { indexTable, ownerColumn, valueColumn } = getIndexDefinition(indexName);

    if (indexTable === table) {
      const rows = await db
        .select()
        .from(table)
        .where(inArray(valueColumn, values));
      return rows as TValue[];
    }

    const rows = await db
      .select({ owner: table })
      .from(table)
      .innerJoin(indexTable, eq(keyColumn, ownerColumn))
      .where(inArray(valueColumn, values));

    return rows.map((row) => row.owner) as TValue[];
  };

  const getDistinctIndexValues = async (indexName: string): Promise<string[]> => {
    const { indexTable, valueColumn } = getIndexDefinition(indexName);

    const rows = await db.selectDistinct({ value: valueColumn }).from(indexTable).orderBy(valueColumn);
    return rows.map((row) => row.value) as string[];
  };

  const put = async (entries: RepositoryEntry<TValue, TKey>[]): Promise<void> => {
    await base.put(entries);

    const indexNames = Object.keys(indexesByStoreName[storeName] ?? {});
    const keys = entries.map((entry) => keyOf(entry.value));

    await Promise.all(indexNames.map(async (indexName) => {
      const { indexTable, sourceFieldName, ownerFieldName, valueFieldName, ownerColumn } = getIndexDefinition(indexName);

      // skip the delete+reinsert sync for self-referencing indexes (aka frames table)
      if (indexTable === table) {
        return;
      }

      await db.delete(indexTable).where(inArray(ownerColumn, keys));

      const rows = entries.flatMap((entry) => {
        const values = (entry.value as Record<string, unknown>)[sourceFieldName] as string[] | undefined;
        const uniqueValues = [...new Set(values ?? [])];
        return uniqueValues.map((value) => ({ [ownerFieldName]: keyOf(entry.value), [valueFieldName]: value }));
      });

      if (rows.length > 0) {
        await db.insert(indexTable).values(rows);
      }
    }));
  };

  return {
    ...base,
    put,
    getByIndexValues,
    getDistinctIndexValues,
  };
};
