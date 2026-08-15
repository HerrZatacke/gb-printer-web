import {
  type BinaryStoreItem,
  type DeleteBinaryItemsByHashesParams,
  type GetBinaryItemsByHashesParams,
  type ItemsSourceResponse,
  type ItemsSourceTotalResponse,
  type UpdateBinaryItemsParams,
} from 'gb-printer-schemas';
import z, { type ZodType } from 'zod';
import { getAddPaging, getAddTotal } from '@/workers/itemsIndexedDbWorker/queries/helpers/generic';
import { type ItemsSourceInternal } from '@/workers/itemsIndexedDbWorker/types';

export const createBinaryStoreQueries = (repositoryKey: 'binaryImages' | 'binaryFrames', schema: ZodType<BinaryStoreItem>) => {
  async function getByHashes(this: ItemsSourceInternal, { hashes }: GetBinaryItemsByHashesParams): Promise<ItemsSourceResponse<BinaryStoreItem>> {
    const { [repositoryKey]: repository } = this.db;
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
  }

  async function getHashes(this: ItemsSourceInternal): Promise<ItemsSourceTotalResponse<string>> {
    const { [repositoryKey]: repository } = this.db;
    const start = performance.now();

    const hashes = await repository.getAllKeys();
    const total = await repository.count();

    const addPaging = getAddTotal<string>(total, start, z.string());

    return addPaging(hashes);
  }

  async function update(this: ItemsSourceInternal, { items }: UpdateBinaryItemsParams): Promise<void> {
    const parsedItems = z.array(schema).parse(items);
    const { [repositoryKey]: repository } = this.db;

    await repository.put(
      parsedItems.map((parsedItem) => ({ key: parsedItem.hash, value: parsedItem.data })),
    );
  }

  async function deleteByHashes(this: ItemsSourceInternal, { hashes }: DeleteBinaryItemsByHashesParams): Promise<void> {
    const { [repositoryKey]: repository } = this.db;
    await repository.deleteByKeys(hashes);
  }

  return { getByHashes, getHashes, update, deleteByHashes };
};
