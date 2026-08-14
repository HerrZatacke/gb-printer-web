import {
  type BinaryStoreItem,
  type DeleteBinaryItemsByHashesParams,
  type GetBinaryItemsByHashesParams,
  type ItemsSourceResponse,
  type ItemsSourceTotalResponse,
  type UpdateBinaryItemsParams,
} from 'gb-printer-schemas';
import z, { type ZodType } from 'zod';
import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { getAddPaging, getAddTotal } from '@/workers/itemsIndexedDbWorker/queries/helpers/generic';

export const createBinaryStoreQueries = (repositoryKey: 'binaryImages' | 'binaryFrames', schema: ZodType<BinaryStoreItem>) => {
  const getByHashes = async ({ hashes }: GetBinaryItemsByHashesParams): Promise<ItemsSourceResponse<BinaryStoreItem>> => {
    const { [repositoryKey]: repository } = await getDb();
    const start = performance.now();

    const total = await repository.count();
    const entries = await repository.getEntriesByKeys(hashes);
    const dataByHash = new Map<string, string>(entries.map(({ key, value }) => [key, value]));

    // Positional correspondence to `hashes` is relied on by callers, so re-derive
    // `items` from `hashes` itself (not from `entries`) to preserve both the
    // original order and a `null` placeholder for hashes with no stored data.
    const items = hashes.map((hash): BinaryStoreItem | null => {
      const data = dataByHash.get(hash);
      return data ? { hash, data } : null;
    });

    const filteredItems = items.filter((item): item is BinaryStoreItem => Boolean(item));

    const addPaging = getAddPaging<BinaryStoreItem>(total, 0, items.length, start, schema);

    return addPaging(filteredItems);
  };

  const getHashes = async (): Promise<ItemsSourceTotalResponse<string>> => {
    const { [repositoryKey]: repository } = await getDb();
    const start = performance.now();

    const hashes = await repository.getAllKeys();
    const total = await repository.count();

    const addPaging = getAddTotal<string>(total, start, z.string());

    return addPaging(hashes);
  };

  const update = async ({ items }: UpdateBinaryItemsParams): Promise<void> => {
    const parsedItems = z.array(schema).parse(items);
    const { [repositoryKey]: repository } = await getDb();

    await repository.put(
      parsedItems.map((parsedItem) => ({ key: parsedItem.hash, value: parsedItem.data })),
    );
  };

  const deleteByHashes = async ({ hashes }: DeleteBinaryItemsByHashesParams): Promise<void> => {
    const { [repositoryKey]: repository } = await getDb();
    await repository.deleteByKeys(hashes);
  };

  return { getByHashes, getHashes, update, deleteByHashes };
};
