import { BinaryStoreItemSchema } from '@/types/BinaryStoreItem';
import { createBinaryStoreQueries } from '@/workers/itemsIndexedDbWorker/queries/createBinaryStoreQueries';

export const {
  getByHashes: getBinaryFramesByHashes,
  getHashes: getBinaryFrameHashes,
  update: updateBinaryFrames,
  deleteByHashes: deleteBinaryFramesByHashes,
} = createBinaryStoreQueries('binaryframes', BinaryStoreItemSchema);
