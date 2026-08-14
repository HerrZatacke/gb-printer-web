export interface RepositoryEntry<TValue, TKey extends string = string> {
  key: TKey;
  value: TValue;
}

export interface ItemRepository<TValue, TKey extends string = string> {
  count(): Promise<number>;
  getAll(): Promise<TValue[]>;
  getAllKeys(): Promise<TKey[]>;
  getByKey(key: TKey): Promise<TValue | undefined>;
  getEntriesByKeys(keys: TKey[]): Promise<RepositoryEntry<TValue, TKey>[]>;
  iterate(): AsyncIterable<TValue>;
  put(entries: RepositoryEntry<TValue, TKey>[]): Promise<void>;
  deleteByKeys(keys: TKey[]): Promise<void>;
  clear(): Promise<void>;
}

export interface IndexedItemRepository<TValue, TKey extends string = string>
  extends ItemRepository<TValue, TKey> {
  getByIndexValues(indexName: string, values: string[]): Promise<TValue[]>;
  getDistinctIndexValues(indexName: string): Promise<string[]>;
}
