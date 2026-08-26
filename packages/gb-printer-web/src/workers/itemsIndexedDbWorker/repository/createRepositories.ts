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
import { type IDBPDatabase } from 'idb';
import {
  createIdbRepository,
  createIndexedIdbRepository,
} from '@/workers/itemsIndexedDbWorker/repository/createIdbRepository';
import { type ItemsDB } from '@/workers/itemsIndexedDbWorker/types';

export const createRepositories = (db: IDBPDatabase<ItemsDB>): Repositories => ({
  [ItemStoreNames.IMAGES]: createIndexedIdbRepository(db, imagesConfig),
  [ItemStoreNames.FRAMES]: createIndexedIdbRepository(db, framesConfig),
  [ItemStoreNames.FRAMEGROUPS]: createIdbRepository(db, frameGroupsConfig),
  [ItemStoreNames.IMAGEGROUPS]: createIdbRepository(db, imageGroupsConfig),
  [ItemStoreNames.PALETTES]: createIdbRepository(db, palettesConfig),
  [ItemStoreNames.PLUGINS]: createIdbRepository(db, pluginsConfig),
  [ItemStoreNames.BINARYIMAGES]: createIdbRepository(db, binaryImagesConfig),
  [ItemStoreNames.BINARYFRAMES]: createIdbRepository(db, binaryFramesConfig),
});
