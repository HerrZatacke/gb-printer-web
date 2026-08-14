import { BinaryStoreItemSchema } from 'gb-printer-schemas';
import { createBinaryStoreQueries } from '@/workers/itemsIndexedDbWorker/queries/createBinaryStoreQueries';

export const {
  getByHashes: getBinaryFramesByHashes,
  getHashes: getBinaryFrameHashes,
  update: updateBinaryFrames,
  deleteByHashes: deleteBinaryFramesByHashes,
} = createBinaryStoreQueries('binaryFrames', BinaryStoreItemSchema);
