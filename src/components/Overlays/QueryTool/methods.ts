import { ItemsSource } from '@/workers/itemsIndexedDbWorker/types';

type MethodName = keyof Omit<ItemsSource, 'init' | 'debugReset' | 'runMaintenance'>;

export const itemsSourceMethodNames = [
  'getStats',
  'getUsages',
  'getAllTags',
  'getGroupItemsByGroupId',
  'getHashesByGroupId',
  'getImages',
  'getImagesByHashes',
  'getImagesByAnyHashes',
  'updateImages',
  'deleteImagesByHashes',
  'getImageGroupsFullTree',
  'getImageGroupsList',
  'updateImageGroups',
  'deleteImageGroupsByIds',
  'getFrames',
  'getFramesByHashes',
  'getFramesByIds',
  'updateFrames',
  'deleteFramesByIds',
  'getFrameGroups',
  'updateFrameGroups',
  'deleteFrameGroupsByIds',
  'getPalettes',
  'getPalettesByShortNames',
  'updatePalettes',
  'deletePalettesByShortNames',
  'getPlugins',
  'getPluginsByUrls',
  'updatePlugins',
  'deletePluginsByUrls',
  'getBinaryImagesByHashes',
  'getBinaryImageHashes',
  'updateBinaryImages',
  'deleteBinaryImagesByHashes',
  'getBinaryFramesByHashes',
  'getBinaryFrameHashes',
  'updateBinaryFrames',
  'deleteBinaryFramesByHashes',
] as const satisfies readonly (MethodName)[];

type AssertExhaustive = Exclude<MethodName, (typeof itemsSourceMethodNames)[number]> extends never ? true : never;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _exhaustiveCheck: AssertExhaustive = true;
