import { ItemStoreNames, BinaryStoreItemSchema } from 'gb-printer-schemas';
import { createBinaryStoreQueries } from '@/queries/createBinaryStoreQueries';

export const {
  getByHashes: getBinaryImagesByHashes,
  getHashes: getBinaryImageHashes,
  update: updateBinaryImages,
  deleteByHashes: deleteBinaryImagesByHashes,
} = createBinaryStoreQueries(ItemStoreNames.BINARYIMAGES, BinaryStoreItemSchema);
