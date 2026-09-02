import {
  ItemStoreNames,
  type BinaryStoreItem,
  type DeleteBinaryItemsByHashesParams,
  type GetBinaryItemsByHashesParams,
  type ItemsSourceResponse,
  type ItemsSourceTotalResponse,
  type UpdateBinaryItemsParams,
  type ItemsMutationReponse,
} from 'gb-printer-schemas';
import z, { type ZodType } from 'zod';
import { frameExistsByHash } from '@/queries/frames';
import { getAddPaging, getAddTotal, getMutationReponse } from '@/queries/helpers/generic';
import { imageExistsByAnyHash } from '@/queries/images';
import { type ItemsSourceInternal } from '@/types';

export const createBinaryStoreQueries = (
  repositoryKey: typeof ItemStoreNames.BINARYIMAGES | typeof ItemStoreNames.BINARYFRAMES,
  schema: ZodType<BinaryStoreItem>,
) => {
  async function getByHashes(this: ItemsSourceInternal, { hashes }: GetBinaryItemsByHashesParams): Promise<ItemsSourceResponse<BinaryStoreItem>> {
    const { [repositoryKey]: repository } = this.repositories;
    const start = performance.now();

    const total = await repository.count();
    const entries = await repository.getEntriesByKeys(hashes);
    const dataByHash = new Map<string, string>(entries.map(({ key, value }) => [key, value]));

    // Positional is relevant -> map result to original hash order
    const items = hashes.map((hash): BinaryStoreItem | null => {
      const data = dataByHash.get(hash);
      return data ? { hash, data } : null;
    });

    const filteredItems = items.filter((item): item is BinaryStoreItem => Boolean(item));

    const addPaging = getAddPaging<BinaryStoreItem>(total, 0, items.length, start, schema);

    return addPaging(filteredItems);
  }

  async function getHashes(this: ItemsSourceInternal): Promise<ItemsSourceTotalResponse<string>> {
    const { [repositoryKey]: repository } = this.repositories;
    const start = performance.now();

    const hashes = await repository.getAllKeys();
    const total = await repository.count();

    const addPaging = getAddTotal<string>(total, start, z.string());

    return addPaging(hashes);
  }

  async function update(this: ItemsSourceInternal, { items }: UpdateBinaryItemsParams): Promise<ItemsMutationReponse> {
    const mutationReponse = getMutationReponse(performance.now());
    const parsedItems = z.array(schema).parse(items);
    const { [repositoryKey]: repository } = this.repositories;

    await repository.put(
      parsedItems.map((parsedItem) => ({ key: parsedItem.hash, value: parsedItem.data })),
    );

    return mutationReponse([{ collection: repositoryKey }]);
  }

  async function deleteByHashes(this: ItemsSourceInternal, { hashes }: DeleteBinaryItemsByHashesParams): Promise<ItemsMutationReponse> {
    const mutationReponse = getMutationReponse(performance.now());
    const { [repositoryKey]: repository } = this.repositories;
    await repository.deleteByKeys(hashes);

    return mutationReponse([{ collection: repositoryKey }]);
  }

  async function getOrphanedHashes(this: ItemsSourceInternal): Promise<ItemsSourceTotalResponse<string>> {
    const start = performance.now();

    const existenceCheck = (
      repositoryKey === ItemStoreNames.BINARYIMAGES
        ? imageExistsByAnyHash
        : frameExistsByHash
    ).bind(this);

    const { items: storedHashes } = await getHashes.call(this);

    const existsFlags = await Promise.all(
      storedHashes.map((hash) => existenceCheck(hash)),
    );

    const orphanedHashes = storedHashes.filter((_hash, index) => !existsFlags[index]);

    const addTotal = getAddTotal<string>(storedHashes.length, start, z.string());

    return addTotal(orphanedHashes);
  }

  return { getByHashes, getHashes, update, deleteByHashes, getOrphanedHashes };
};
