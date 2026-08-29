import { type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import {
  type Repositories,
  imagesConfig,
  framesConfig,
  frameGroupsConfig,
  imageGroupsConfig,
  palettesConfig,
  pluginsConfig,
  binaryImagesConfig,
  binaryFramesConfig,
} from 'gb-items-source';
import { ItemStoreNames } from 'gb-printer-schemas';
import { createDrizzleRepository, createIndexedDrizzleRepository } from '@/repository/createDrizzleRepository ';

export const createRepositories = (
  db: BetterSQLite3Database,
): Repositories => ({
  [ItemStoreNames.IMAGES]: createIndexedDrizzleRepository(db, imagesConfig),
  [ItemStoreNames.FRAMES]: createIndexedDrizzleRepository(db, framesConfig),
  [ItemStoreNames.FRAMEGROUPS]: createDrizzleRepository(db, frameGroupsConfig),
  [ItemStoreNames.IMAGEGROUPS]: createDrizzleRepository(db, imageGroupsConfig),
  [ItemStoreNames.PALETTES]: createDrizzleRepository(db, palettesConfig),
  [ItemStoreNames.PLUGINS]: createDrizzleRepository(db, pluginsConfig),
  [ItemStoreNames.BINARYIMAGES]: createDrizzleRepository(db, binaryImagesConfig),
  [ItemStoreNames.BINARYFRAMES]: createDrizzleRepository(db, binaryFramesConfig),
});
