import  { type SQLiteTable } from 'drizzle-orm/sqlite-core';
import { StoreNames } from 'gb-items-source';
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

export const tableByStoreName: Record<StoreNames, SQLiteTable | null> = {
  [StoreNames.BINARYFRAMES]: binaryFrames,
  [StoreNames.BINARYIMAGES]: binaryImages,
  [StoreNames.FRAMES]: frames,
  [StoreNames.FRAMEGROUPS]: frameGroups,
  [StoreNames.IMAGEGROUPS]: imageGroups,
  [StoreNames.IMAGES]: images,
  [StoreNames.PALETTES]: palettes,
  [StoreNames.PLUGINS]: plugins,
};
