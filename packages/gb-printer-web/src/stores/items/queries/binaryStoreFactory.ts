import {
  type BinaryStoreItem,
  type ItemsSourceResponse,
  type ItemsSourceTotalResponse,
  type ItemsMutationReponse,
} from 'gb-printer-schemas';
import { getQueryClient } from '@/contexts/QueryClient';
import { createBatchedLoader } from '@/stores/items/queries/batchedLoader';
import { STALE_TIME } from '@/stores/items/queries/consts';

interface BinaryStoreSourceApi {
  getByHashes: (hashes: string[]) => Promise<ItemsSourceResponse<BinaryStoreItem>>;
  getHashes: () => Promise<ItemsSourceTotalResponse<string>>;
  getOrphanedHashes: () => Promise<ItemsSourceTotalResponse<string>>;
  update: (items: BinaryStoreItem[]) => Promise<ItemsMutationReponse>;
  deleteByHashes: (hashes: string[]) => Promise<ItemsMutationReponse>;
}

export const createBinaryBlobQueries = (storeLabel: string, sourceApi: BinaryStoreSourceApi) => {
  const baseKeys = ['items', 'binary', storeLabel] as const;

  const keys = {
    all: baseKeys,
    allHashes: [...baseKeys, 'allHashes'] as const,
    orphanedHashes: [...baseKeys, 'orphanedHashes'] as const,
    byHash: (hash: string) => [...baseKeys, 'byHash', hash] as const,
    byHashes: (hashes: string[]) => [...baseKeys, 'byHashes', [...hashes].sort()] as const,
  };

  const warmCache = (items: BinaryStoreItem[]) => {
    const queryClient = getQueryClient();
    items.forEach((item) => {
      queryClient.setQueryData(keys.byHash(item.hash), item);
    });
  };

  const batchedLoader = createBatchedLoader<BinaryStoreItem>(
    async (hashes) => {
      const response = await sourceApi.getByHashes(hashes);
      return {
        duration: response.duration,
        total: response.paging.total,
        items: response.items,
      };
    },
    (item) => item.hash,
    50,
  );

  const hashesQueryOptions = () => ({
    queryKey: keys.allHashes,
    queryFn: async () => sourceApi.getHashes(),
    staleTime: STALE_TIME,
  });

  const orphanedHashesQueryOptions = () => ({
    queryKey: keys.orphanedHashes,
    queryFn: async () => sourceApi.getOrphanedHashes(),
    staleTime: STALE_TIME,
  });

  const byHashQueryOptions = (hash: string) => ({
    queryKey: keys.byHash(hash), // mostly populated by hashesQueryOptions
    queryFn: async () => batchedLoader.loadByKey(hash),
    staleTime: STALE_TIME,
  });

  const byHashesQueryOptions = (hashes: string[]) => {
    return {
      queryKey: keys.byHashes(hashes),
      queryFn: async () => {
        if (!hashes?.length) {
          return { items: [] };
        }

        const results = await Promise.all(hashes.map(batchedLoader.loadByKey));
        const items = results.filter((item): item is BinaryStoreItem => Boolean(item));

        warmCache(items);
        return { items };
      },
      select: (data: { items: BinaryStoreItem[] }) => {
        const byHash = new Map(data.items.map((item) => [item.hash, item]));
        return {
          items: hashes // sort result by this call's original order, not the cached one
            .map((hash) => byHash.get(hash))
            .filter((item): item is BinaryStoreItem => Boolean(item)),
        };
      },
      staleTime: STALE_TIME,
    };
  };

  const updateAction = async (items: BinaryStoreItem[]): Promise<void> => {
    const chunkSize = 1000;
    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      await sourceApi.update(chunk);
    }
  };

  const deleteByHashesAction = async (hashes: string[]): Promise<void> => {
    await sourceApi.deleteByHashes(hashes);
  };

  return {
    keys,
    hashesQueryOptions,
    orphanedHashesQueryOptions,
    byHashQueryOptions,
    byHashesQueryOptions,
    updateAction,
    deleteByHashesAction,
  };
};
