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
import { type IDBPDatabase } from 'idb';
import {
  createIdbRepository,
  createIndexedIdbRepository,
} from '@/workers/itemsIndexedDbWorker/repository/createIdbRepository';
import { type ItemsDB } from '@/workers/itemsIndexedDbWorker/types';

export const createRepositories = (db: IDBPDatabase<ItemsDB>): Repositories => ({
  images: createIndexedIdbRepository(db, imagesConfig),
  frames: createIndexedIdbRepository(db, framesConfig),
  frameGroups: createIdbRepository(db, frameGroupsConfig),
  imageGroups: createIdbRepository(db, imageGroupsConfig),
  palettes: createIdbRepository(db, palettesConfig),
  plugins: createIdbRepository(db, pluginsConfig),
  binaryImages: createIdbRepository(db, binaryImagesConfig),
  binaryFrames: createIdbRepository(db, binaryFramesConfig),
});
