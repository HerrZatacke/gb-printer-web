import { type IDBPDatabase, type StoreNames } from 'idb';
import { type EntityConfig } from '@/workers/itemsIndexedDbWorker/repository/entityConfig';
import {
  type IndexedItemRepository,
  type ItemRepository,
  type RepositoryEntry,
} from '@/workers/itemsIndexedDbWorker/repository/types';
import { type ItemsDB } from '@/workers/itemsIndexedDbWorker/types';

// Minimal shape of the idb store/index API this repository actually uses,
// expressed generically over TValue/TKey. idb itself can only produce this
// shape for a literal store name, not a generic one drawn from
// StoreNames<ItemsDB> - so getReadStore/getWriteTransaction below are the
// single, isolated boundary where that mismatch is bridged. Every method
// past that boundary is fully typed with no further casting.
interface GenericIndex<TValue> {
  getAll(key: string): Promise<TValue[]>;
  openKeyCursor(): Promise<{ key: IDBValidKey; continue(): Promise<unknown> } | null>;
}

interface GenericStore<TValue, TKey extends string> {
  count(): Promise<number>;
  getAll(): Promise<TValue[]>;
  getAllKeys(): Promise<TKey[]>;
  get(key: TKey): Promise<TValue | undefined>;
  put(value: TValue, key?: TKey): Promise<TKey>;
  delete(key: TKey): Promise<void>;
  clear(): Promise<void>;
  index(name: string): GenericIndex<TValue>;
  openCursor(): Promise<{ value: TValue; continue(): Promise<unknown> } | null>;
}

const getReadStore = <TValue, TKey extends string>(
  db: IDBPDatabase<ItemsDB>,
  storeName: StoreNames<ItemsDB>,
): GenericStore<TValue, TKey> => (
  db.transaction(storeName).store as unknown as GenericStore<TValue, TKey>
);

const getWriteTransaction = <TValue, TKey extends string>(
  db: IDBPDatabase<ItemsDB>,
  storeName: StoreNames<ItemsDB>,
): { store: GenericStore<TValue, TKey>; done: Promise<void> } => {
  const tx = db.transaction(storeName, 'readwrite');

  return {
    store: tx.store as unknown as GenericStore<TValue, TKey>,
    done: tx.done,
  };
};

export const createIdbRepository = <TValue, TKey extends string = string>(
  db: IDBPDatabase<ItemsDB>,
  config: EntityConfig<TValue, TKey>,
): ItemRepository<TValue, TKey> => {
  const { storeName, hasKeyPath } = config;

  const count = async (): Promise<number> => {
    return getReadStore<TValue, TKey>(db, storeName).count();
  };

  const getAll = async (): Promise<TValue[]> => {
    return getReadStore<TValue, TKey>(db, storeName).getAll();
  };

  const getAllKeys = async (): Promise<TKey[]> => {
    return getReadStore<TValue, TKey>(db, storeName).getAllKeys();
  };

  const getByKey = async (key: TKey): Promise<TValue | undefined> => {
    return getReadStore<TValue, TKey>(db, storeName).get(key);
  };

  const getEntriesByKeys = async (keys: TKey[]): Promise<RepositoryEntry<TValue, TKey>[]> => {
    const store = getReadStore<TValue, TKey>(db, storeName);
    const values = await Promise.all(keys.map((key) => store.get(key)));

    return keys.reduce<RepositoryEntry<TValue, TKey>[]>((entries, key, index) => {
      const value = values[index];
      if (value !== undefined) {
        entries.push({ key, value });
      }
      return entries;
    }, []);
  };

  const put = async (entries: RepositoryEntry<TValue, TKey>[]): Promise<void> => {
    const { store, done } = getWriteTransaction<TValue, TKey>(db, storeName);

    if (hasKeyPath) {
      await Promise.all(entries.map((entry) => store.put(entry.value)));
    } else {
      await Promise.all(entries.map((entry) => store.put(entry.value, entry.key)));
    }

    await done;
  };

  const deleteByKeys = async (keys: TKey[]): Promise<void> => {
    const { store, done } = getWriteTransaction<TValue, TKey>(db, storeName);
    await Promise.all(keys.map((key) => store.delete(key)));
    await done;
  };

  const clear = async (): Promise<void> => {
    const { store, done } = getWriteTransaction<TValue, TKey>(db, storeName);
    await store.clear();
    await done;
  };

  const iterate = async function* (): AsyncGenerator<TValue> {
    const store = getReadStore<TValue, TKey>(db, storeName);
    let cursor = await store.openCursor();

    while (cursor) {
      yield cursor.value;
      cursor = await cursor.continue() as typeof cursor;
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

export const createIndexedIdbRepository = <TValue, TKey extends string = string>(
  db: IDBPDatabase<ItemsDB>,
  config: EntityConfig<TValue, TKey>,
): IndexedItemRepository<TValue, TKey> => {
  const base = createIdbRepository(db, config);

  const getByIndexValues = async (indexName: string, values: string[]): Promise<TValue[]> => {
    const store = getReadStore<TValue, TKey>(db, config.storeName);
    const index = store.index(indexName);
    const results = await Promise.all(values.map((value) => index.getAll(value)));
    return results.flat();
  };

  const getDistinctIndexValues = async (indexName: string): Promise<string[]> => {
    const store = getReadStore<TValue, TKey>(db, config.storeName);
    const index = store.index(indexName);

    const distinctValues: string[] = [];
    let cursor = await index.openKeyCursor();

    while (cursor) {
      const value = cursor.key as string;
      if (distinctValues[distinctValues.length - 1] !== value) {
        distinctValues.push(value);
      }
      cursor = await cursor.continue() as typeof cursor;
    }

    return distinctValues;
  };

  return {
    ...base,
    getByIndexValues,
    getDistinctIndexValues,
  };
};
