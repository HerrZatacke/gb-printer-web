import { ItemsSource } from '@/workers/itemsIndexedDbWorker/types';

export type MethodName = keyof Omit<ItemsSource, 'init' | 'debugReset' | 'runMaintenance'>;

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

const exampleImageQuerySort = {
  field: 'created',
  direction: 'asc',
};
const exampleImageQuerySortJSON = JSON.stringify(exampleImageQuerySort);

const exampleFilters = {
  tags: [
    'testing',
  ],
};
const exampleFiltersJSON = JSON.stringify(exampleFilters);

const exampleImageQueryParams = {
  filters: exampleFilters,
  sort: exampleImageQuerySort,
  page: 0,
  pageSize: 15,
};
const exampleImageQueryParamsJSON = JSON.stringify(exampleImageQueryParams);

export const exampleBodies: Record<MethodName, string> = {
  getStats: '',
  getUsages: '',
  getAllTags: '',
  getGroupItemsByGroupId: `{"groupId": "", "includeGroups": true, "params": ${exampleImageQueryParamsJSON}}`,
  getHashesByGroupId: `{"groupId": "", "includeGroups": true, "sort": ${exampleImageQuerySortJSON}, "filters": ${exampleFiltersJSON}}`,
  getImages: '{}',
  getImagesByHashes: '{}',
  getImagesByAnyHashes: '{}',
  updateImages: '{}',
  deleteImagesByHashes: '{}',
  getImageGroupsFullTree: '', // empty
  getImageGroupsList: '', // empty
  updateImageGroups: '{}',
  deleteImageGroupsByIds: '{}',
  getFrames: '', // empty
  getFramesByHashes: '{}',
  getFramesByIds: '{}',
  updateFrames: '{}',
  deleteFramesByIds: '{}',
  getFrameGroups: '', // empty
  updateFrameGroups: '{}',
  deleteFrameGroupsByIds: '{}',
  getPalettes: '', // empty
  getPalettesByShortNames: '{}',
  updatePalettes: '{}',
  deletePalettesByShortNames: '{}',
  getPlugins: '', // empty
  getPluginsByUrls: '{}',
  updatePlugins: '{}',
  deletePluginsByUrls: '{}',
  getBinaryImagesByHashes: '{}',
  getBinaryImageHashes: '', // empty
  updateBinaryImages: '{}',
  deleteBinaryImagesByHashes: '{}',
  getBinaryFramesByHashes: '{}',
  getBinaryFrameHashes: '', // empty
  updateBinaryFrames: '{}',
  deleteBinaryFramesByHashes: '{}',
};
