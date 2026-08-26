import {
  ItemStoreNames,
  type Frame,
  type FrameGroup,
  type Palette,
  type Plugin,
  type StoredImage,
  type StoredSerializableImageGroup,
} from 'gb-printer-schemas';
import { type EntityConfig } from '@/repository/entityConfig';

export const imagesConfig: EntityConfig<StoredImage> = {
  storeName: ItemStoreNames.IMAGES,
  hasKeyPath: true,
  keyOf: (image) => image.hash,
};

export const framesConfig: EntityConfig<Frame> = {
  storeName: ItemStoreNames.FRAMES,
  hasKeyPath: true,
  keyOf: (frame) => frame.id,
};

export const frameGroupsConfig: EntityConfig<FrameGroup> = {
  storeName: ItemStoreNames.FRAMEGROUPS,
  hasKeyPath: true,
  keyOf: (frameGroup) => frameGroup.id,
};

export const imageGroupsConfig: EntityConfig<StoredSerializableImageGroup> = {
  storeName: ItemStoreNames.IMAGEGROUPS,
  hasKeyPath: true,
  keyOf: (imageGroup) => imageGroup.id,
};

export const palettesConfig: EntityConfig<Palette> = {
  storeName: ItemStoreNames.PALETTES,
  hasKeyPath: true,
  keyOf: (palette) => palette.shortName,
};

export const pluginsConfig: EntityConfig<Plugin> = {
  storeName: ItemStoreNames.PLUGINS,
  hasKeyPath: true,
  keyOf: (plugin) => plugin.url,
};

export const binaryImagesConfig: EntityConfig<string> = {
  storeName: ItemStoreNames.BINARYIMAGES,
  hasKeyPath: false,
};

export const binaryFramesConfig: EntityConfig<string> = {
  storeName: ItemStoreNames.BINARYFRAMES,
  hasKeyPath: false,
};

