import z, { type ZodType } from 'zod';
import { BinaryStoreItem } from '@/types/BinaryStoreItem';
import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { getAddPaging } from '@/workers/itemsIndexedDbWorker/queries/helpers/generic';
import { type ItemsSourceResponse } from '@/workers/itemsIndexedDbWorker/types';

export const createBinaryStoreQueries = (storeName: 'binaryimages' | 'binaryframes', schema: ZodType<BinaryStoreItem>) => {
  const getByHashes = async (hashes: string[]): Promise<ItemsSourceResponse<BinaryStoreItem>> => {
    const db = await getDb();
    const start = performance.now();

    const { store } = db.transaction(storeName);
    const total = await store.count();

    const items = await Promise.all(
      hashes.map(async (hash): Promise<BinaryStoreItem | null> => {
        const data = await store.get(hash);
        if (!data) {
          return null;
        }

        return { hash, data };
      }),
    );

    const filteredItems = items.filter((item): item is BinaryStoreItem => Boolean(item));

    const addPaging = getAddPaging<BinaryStoreItem>(total, 0, items.length, start, schema);

    return addPaging(filteredItems);
  };

  const getHashes = async (): Promise<ItemsSourceResponse<string>> => {
    const db = await getDb();
    const start = performance.now();

    const { store } = db.transaction(storeName);
    const hashes = await store.getAllKeys();
    const total = await store.count();

    const addPaging = getAddPaging<string>(total, 0, hashes.length, start, z.string());

    return addPaging(hashes);
  };

  const update = async (items: BinaryStoreItem[]): Promise<void> => {
    const { success, data: parsedItems, error } = z.array(schema).safeParse(items);

    if (!success) {
      console.error(error);
      return;
    }

    const db = await getDb();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.store;

    await Promise.all(parsedItems.map((parsedItem) => store.put(parsedItem.data, parsedItem.hash)));
    await tx.done;
  };

  const deleteByHashes = async (hashes: string[]): Promise<void> => {
    const db = await getDb();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.store;

    await Promise.all(hashes.map((hash) => store.delete(hash)));
    await tx.done;
  };

  return { getByHashes, getHashes, update, deleteByHashes };
};
