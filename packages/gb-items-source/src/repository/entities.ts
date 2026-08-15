import {
  type Frame,
  type FrameGroup,
  type Palette,
  type Plugin,
  type StoredImage,
  type StoredSerializableImageGroup,
} from 'gb-printer-schemas';
import { type EntityConfig } from '@/repository/entityConfig';
import { StoreNames } from '@/types';

export const imagesConfig: EntityConfig<StoredImage> = {
  storeName: StoreNames.IMAGES,
  hasKeyPath: true,
  keyOf: (image) => image.hash,
};

export const framesConfig: EntityConfig<Frame> = {
  storeName: StoreNames.FRAMES,
  hasKeyPath: true,
  keyOf: (frame) => frame.id,
};

export const frameGroupsConfig: EntityConfig<FrameGroup> = {
  storeName: StoreNames.FRAMEGROUPS,
  hasKeyPath: true,
  keyOf: (frameGroup) => frameGroup.id,
};

export const imageGroupsConfig: EntityConfig<StoredSerializableImageGroup> = {
  storeName: StoreNames.IMAGEGROUPS,
  hasKeyPath: true,
  keyOf: (imageGroup) => imageGroup.id,
};

export const palettesConfig: EntityConfig<Palette> = {
  storeName: StoreNames.PALETTES,
  hasKeyPath: true,
  keyOf: (palette) => palette.shortName,
};

export const pluginsConfig: EntityConfig<Plugin> = {
  storeName: StoreNames.PLUGINS,
  hasKeyPath: true,
  keyOf: (plugin) => plugin.url,
};

export const binaryImagesConfig: EntityConfig<string> = {
  storeName: StoreNames.BINARYIMAGES,
  hasKeyPath: false,
};

export const binaryFramesConfig: EntityConfig<string> = {
  storeName: StoreNames.BINARYFRAMES,
  hasKeyPath: false,
};

