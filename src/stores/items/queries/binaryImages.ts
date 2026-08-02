import { getItemsSource } from '@/stores/items/client';
import { createBinaryBlobQueries } from '@/stores/items/queries/binaryStoreFactory';

export const {
  hashesQueryOptions: binaryImageHashesQueryOptions,
  byHashQueryOptions: binaryImageByHashQueryOptions,
  byHashesQueryOptions: binaryImagesByHashesQueryOptions,
  updateAction: updateBinaryImagesAction,
  deleteByHashesAction: deleteBinaryImagesByHashesAction,
} = createBinaryBlobQueries('images', {
  getByHashes: async (hashes) => (await getItemsSource()).getBinaryImagesByHashes(hashes),
  getHashes: async () => (await getItemsSource()).getBinaryImageHashes(),
  update: async (items) => (await getItemsSource()).updateBinaryImages(items),
  deleteByHashes: async (hashes) => (await getItemsSource()).deleteBinaryImagesByHashes(hashes),
});
