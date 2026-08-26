import { ItemStoreNames, BinaryStoreItemSchema } from 'gb-printer-schemas';
import { createBinaryStoreQueries } from '@/queries/createBinaryStoreQueries';

export const {
  getByHashes: getBinaryFramesByHashes,
  getHashes: getBinaryFrameHashes,
  update: updateBinaryFrames,
  deleteByHashes: deleteBinaryFramesByHashes,
} = createBinaryStoreQueries(ItemStoreNames.BINARYFRAMES, BinaryStoreItemSchema);
