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
  ownerId: string,
): Repositories => ({
  [ItemStoreNames.IMAGES]: createIndexedDrizzleRepository(db, ownerId, imagesConfig),
  [ItemStoreNames.FRAMES]: createIndexedDrizzleRepository(db, ownerId, framesConfig),
  [ItemStoreNames.FRAMEGROUPS]: createDrizzleRepository(db, ownerId, frameGroupsConfig),
  [ItemStoreNames.IMAGEGROUPS]: createDrizzleRepository(db, ownerId, imageGroupsConfig),
  [ItemStoreNames.PALETTES]: createDrizzleRepository(db, ownerId, palettesConfig),
  [ItemStoreNames.PLUGINS]: createDrizzleRepository(db, ownerId, pluginsConfig),
  [ItemStoreNames.BINARYIMAGES]: createDrizzleRepository(db, ownerId, binaryImagesConfig),
  [ItemStoreNames.BINARYFRAMES]: createDrizzleRepository(db, ownerId, binaryFramesConfig),
});
