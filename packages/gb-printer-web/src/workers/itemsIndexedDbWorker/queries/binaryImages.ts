import { BinaryStoreItemSchema } from '@/types/BinaryStoreItem';
import { createBinaryStoreQueries } from '@/workers/itemsIndexedDbWorker/queries/createBinaryStoreQueries';

export const {
  getByHashes: getBinaryImagesByHashes,
  getHashes: getBinaryImageHashes,
  update: updateBinaryImages,
  deleteByHashes: deleteBinaryImagesByHashes,
} = createBinaryStoreQueries('binaryimages', BinaryStoreItemSchema);
