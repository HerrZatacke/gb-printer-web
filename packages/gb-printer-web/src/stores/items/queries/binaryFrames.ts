import { getItemsSource } from '@/stores/items/client';
import { createBinaryBlobQueries } from '@/stores/items/queries/binaryStoreFactory';

export const {
  keys: binaryFramesKeys,
  hashesQueryOptions: binaryFrameHashesQueryOptions,
  byHashQueryOptions: binaryFrameByHashQueryOptions,
  byHashesQueryOptions: binaryFramesByHashesQueryOptions,
  updateAction: updateBinaryFramesAction,
  deleteByHashesAction: deleteBinaryFramesByHashesAction,
  orphanedHashesQueryOptions: binaryFramesOrphanedHashesQueryOptions,
} = createBinaryBlobQueries('frames', {
  getByHashes: async (hashes) => (await getItemsSource()).getBinaryFramesByHashes({ hashes }),
  getHashes: async () => (await getItemsSource()).getBinaryFrameHashes(),
  getOrphanedHashes: async () => (await getItemsSource()).getOrphanedFrameHashes(),
  update: async (items) => (await getItemsSource()).updateBinaryFrames({ items }),
  deleteByHashes: async (hashes) => (await getItemsSource()).deleteBinaryFramesByHashes({ hashes }),
});
