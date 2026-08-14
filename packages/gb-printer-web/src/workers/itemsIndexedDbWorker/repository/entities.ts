import {
  type Frame,
  type FrameGroup,
  type Palette,
  type Plugin,
  type StoredImage,
  type StoredSerializableImageGroup,
} from 'gb-printer-schemas';
import { type IDBPDatabase } from 'idb';
import {
  createIdbRepository,
  createIndexedIdbRepository,
} from '@/workers/itemsIndexedDbWorker/repository/createIdbRepository';
import { type EntityConfig } from '@/workers/itemsIndexedDbWorker/repository/entityConfig';
import { type IndexedItemRepository, type ItemRepository } from '@/workers/itemsIndexedDbWorker/repository/types';
import { type ItemsDB } from '@/workers/itemsIndexedDbWorker/types';

const imagesConfig: EntityConfig<StoredImage> = {
  storeName: 'images',
  hasKeyPath: true,
  keyOf: (image) => image.hash,
};

const framesConfig: EntityConfig<Frame> = {
  storeName: 'frames',
  hasKeyPath: true,
  keyOf: (frame) => frame.id,
};

const frameGroupsConfig: EntityConfig<FrameGroup> = {
  storeName: 'framegroups',
  hasKeyPath: true,
  keyOf: (frameGroup) => frameGroup.id,
};

const imageGroupsConfig: EntityConfig<StoredSerializableImageGroup> = {
  storeName: 'imagegroups',
  hasKeyPath: true,
  keyOf: (imageGroup) => imageGroup.id,
};

const palettesConfig: EntityConfig<Palette> = {
  storeName: 'palettes',
  hasKeyPath: true,
  keyOf: (palette) => palette.shortName,
};

const pluginsConfig: EntityConfig<Plugin> = {
  storeName: 'plugins',
  hasKeyPath: true,
  keyOf: (plugin) => plugin.url,
};

const binaryImagesConfig: EntityConfig<string> = {
  storeName: 'binaryimages',
  hasKeyPath: false,
};

const binaryFramesConfig: EntityConfig<string> = {
  storeName: 'binaryframes',
  hasKeyPath: false,
};

export interface Repositories {
  images: IndexedItemRepository<StoredImage>;
  frames: IndexedItemRepository<Frame>;
  frameGroups: ItemRepository<FrameGroup>;
  imageGroups: ItemRepository<StoredSerializableImageGroup>;
  palettes: ItemRepository<Palette>;
  plugins: ItemRepository<Plugin>;
  binaryImages: ItemRepository<string>;
  binaryFrames: ItemRepository<string>;
}

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
