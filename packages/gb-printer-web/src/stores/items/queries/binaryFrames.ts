import { getItemsSource } from '@/stores/items/client';
import { createBinaryBlobQueries } from '@/stores/items/queries/binaryStoreFactory';

export const {
  hashesQueryOptions: binaryFrameHashesQueryOptions,
  byHashQueryOptions: binaryFrameByHashQueryOptions,
  byHashesQueryOptions: binaryFramesByHashesQueryOptions,
  updateAction: updateBinaryFramesAction,
  deleteByHashesAction: deleteBinaryFramesByHashesAction,
} = createBinaryBlobQueries('frames', {
  getByHashes: async (hashes) => (await getItemsSource()).getBinaryFramesByHashes({ hashes }),
  getHashes: async () => (await getItemsSource()).getBinaryFrameHashes(),
  update: async (items) => (await getItemsSource()).updateBinaryFrames({ items }),
  deleteByHashes: async (hashes) => (await getItemsSource()).deleteBinaryFramesByHashes({ hashes }),
});
