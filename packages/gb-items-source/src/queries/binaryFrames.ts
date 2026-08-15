import { BinaryStoreItemSchema } from 'gb-printer-schemas';
import { createBinaryStoreQueries } from '@/queries/createBinaryStoreQueries';

export const {
  getByHashes: getBinaryFramesByHashes,
  getHashes: getBinaryFrameHashes,
  update: updateBinaryFrames,
  deleteByHashes: deleteBinaryFramesByHashes,
} = createBinaryStoreQueries('binaryFrames', BinaryStoreItemSchema);
