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

// Order is used in SheetsTable
export const sheetNames: SheetName[] = [
  SheetName.IMAGES,
  SheetName.RGBN_IMAGES,
  SheetName.BIN_IMAGES,
  SheetName.IMAGE_GROUPS,
  SheetName.FRAMES,
  SheetName.BIN_FRAMES,
  SheetName.FRAME_GROUPS,
  SheetName.PALETTES,
  SheetName.PLUGINS,
];

export const LASTUPDATE_METADATA_KEY = 'lastUpdate';
