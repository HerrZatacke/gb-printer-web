export enum SheetName {
  BIN_FRAMES = 'binFrames',
  BIN_IMAGES = 'binImages',
  FRAME_GROUPS = 'frameGroups',
  FRAMES = 'frames',
  IMAGE_GROUPS = 'imageGroups',
  IMAGES = 'images',
  PALETTES = 'palettes',
  PLUGINS = 'plugins',
  RGBN_IMAGES = 'rgbnImages',
}

export type GapiLastUpdates = Record<SheetName, number>;

export const sheetNames: SheetName[] = [
  SheetName.BIN_FRAMES,
  SheetName.BIN_IMAGES,
  SheetName.FRAME_GROUPS,
  SheetName.FRAMES,
  SheetName.IMAGE_GROUPS,
  SheetName.IMAGES,
  SheetName.PALETTES,
  SheetName.PLUGINS,
  SheetName.RGBN_IMAGES,
];

export const LASTUPDATE_METADATA_KEY = 'lastUpdate';
