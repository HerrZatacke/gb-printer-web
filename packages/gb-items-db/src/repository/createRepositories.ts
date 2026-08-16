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
import { type RawSqliteDb } from '@/db/connections';
import { createDrizzleRepository, createIndexedDrizzleRepository } from '@/repository/createDrizzleRepository ';

export const createRepositories = (
  db: BetterSQLite3Database,
  sqlite: RawSqliteDb,
): Repositories => ({
  images: createIndexedDrizzleRepository(db, sqlite, imagesConfig),
  frames: createIndexedDrizzleRepository(db, sqlite, framesConfig),
  frameGroups: createDrizzleRepository(db, sqlite, frameGroupsConfig),
  imageGroups: createDrizzleRepository(db, sqlite, imageGroupsConfig),
  palettes: createDrizzleRepository(db, sqlite, palettesConfig),
  plugins: createDrizzleRepository(db, sqlite, pluginsConfig),
  binaryImages: createDrizzleRepository(db, sqlite, binaryImagesConfig),
  binaryFrames: createDrizzleRepository(db, sqlite, binaryFramesConfig),
});
