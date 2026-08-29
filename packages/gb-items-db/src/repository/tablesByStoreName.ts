import  { type SQLiteTable } from 'drizzle-orm/sqlite-core';
import { ItemStoreNames } from 'gb-printer-schemas';
import {
  binaryFrames,
  binaryImages,
  frames,
  frameGroups,
  images,
  imageGroups,
  palettes,
  plugins,
} from '@/db/schema';

export const tableByStoreName: Record<ItemStoreNames, SQLiteTable | null> = {
  [ItemStoreNames.BINARYFRAMES]: binaryFrames,
  [ItemStoreNames.BINARYIMAGES]: binaryImages,
  [ItemStoreNames.FRAMES]: frames,
  [ItemStoreNames.FRAMEGROUPS]: frameGroups,
  [ItemStoreNames.IMAGEGROUPS]: imageGroups,
  [ItemStoreNames.IMAGES]: images,
  [ItemStoreNames.PALETTES]: palettes,
  [ItemStoreNames.PLUGINS]: plugins,
};
