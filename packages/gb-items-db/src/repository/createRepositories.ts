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
import { createDrizzleRepository, createIndexedDrizzleRepository } from '@/repository/createDrizzleRepository ';


export const createRepositories = (db: BetterSQLite3Database): Repositories => ({
  images: createIndexedDrizzleRepository(db, imagesConfig),
  frames: createIndexedDrizzleRepository(db, framesConfig),
  frameGroups: createDrizzleRepository(db, frameGroupsConfig),
  imageGroups: createDrizzleRepository(db, imageGroupsConfig),
  palettes: createDrizzleRepository(db, palettesConfig),
  plugins: createDrizzleRepository(db, pluginsConfig),
  binaryImages: createDrizzleRepository(db, binaryImagesConfig),
  binaryFrames: createDrizzleRepository(db, binaryFramesConfig),
});
