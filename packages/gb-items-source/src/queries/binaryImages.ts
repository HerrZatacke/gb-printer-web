import { BinaryStoreItemSchema } from 'gb-printer-schemas';
import { createBinaryStoreQueries } from '@/queries/createBinaryStoreQueries';

export const {
  getByHashes: getBinaryImagesByHashes,
  getHashes: getBinaryImageHashes,
  update: updateBinaryImages,
  deleteByHashes: deleteBinaryImagesByHashes,
} = createBinaryStoreQueries('binaryImages', BinaryStoreItemSchema);
