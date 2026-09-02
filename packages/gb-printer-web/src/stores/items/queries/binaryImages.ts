import { getItemsSource } from '@/stores/items/client';
import { createBinaryBlobQueries } from '@/stores/items/queries/binaryStoreFactory';

export const {
  keys: binaryImagesKeys,
  hashesQueryOptions: binaryImageHashesQueryOptions,
  byHashQueryOptions: binaryImageByHashQueryOptions,
  byHashesQueryOptions: binaryImagesByHashesQueryOptions,
  updateAction: updateBinaryImagesAction,
  deleteByHashesAction: deleteBinaryImagesByHashesAction,
  orphanedHashesQueryOptions: binaryImagesOrphanedHashesQueryOptions,
} = createBinaryBlobQueries('images', {
  getByHashes: async (hashes) => (await getItemsSource()).getBinaryImagesByHashes({ hashes }),
  getHashes: async () => (await getItemsSource()).getBinaryImageHashes(),
  getOrphanedHashes: async () => (await getItemsSource()).getOrphanedImageHashes(),
  update: async (items) => (await getItemsSource()).updateBinaryImages({ items }),
  deleteByHashes: async (hashes) => (await getItemsSource()).deleteBinaryImagesByHashes({ hashes }),
});
