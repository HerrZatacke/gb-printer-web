import { ItemsSource } from 'gb-items-source';
import {
  GetGroupItemsByGroupIdParamsSchema,
  GetHashesByGroupIdParamsSchema,
  GetImagesParamsSchema,
  GetImagesByHashesParamsSchema,
  GetImagesByAnyHashesParamsSchema,
  UpdateImagesParamsSchema,
  DeleteImagesByHashesParamsSchema,
  UpdateImageGroupsParamsSchema,
  DeleteImageGroupsByIdsParamsSchema,
  GetFramesByHashesParamsSchema,
  GetFramesByIdsParamsSchema,
  UpdateFramesParamsSchema,
  DeleteFramesByIdsParamsSchema,
  UpdateFrameGroupsParamsSchema,
  DeleteFrameGroupsByIdsParamsSchema,
  GetPalettesByShortNamesParamsSchema,
  UpdatePalettesParamsSchema,
  DeletePalettesByShortNamesParamsSchema,
  GetPluginsByUrlsParamsSchema,
  UpdatePluginsParamsSchema,
  DeletePluginsByUrlsParamsSchema,
  GetBinaryItemsByHashesParamsSchema,
  UpdateBinaryItemsParamsSchema,
  DeleteBinaryItemsByHashesParamsSchema,
} from 'gb-printer-schemas';
import z from 'zod';

export type MethodName = keyof Omit<ItemsSource, 'init' | 'runMaintenance'>;

// Used for endpoints that take no arguments at all (no JSON body to parse)
const NoParamsSchema = z.undefined();

export interface EndpointSettings {
  methodName: MethodName;
  remotePath: string;
  exampleBody: string;
  schema: z.ZodType;
  description: string;
}

const exampleImageQuerySort = {
  field: 'created',
  direction: 'asc',
};
const exampleImageQuerySortJSON = JSON.stringify(exampleImageQuerySort);

const exampleFilters = {
  tags: [],
};
const exampleFiltersJSON = JSON.stringify(exampleFilters);

const exampleImageQueryParams = {
  filters: exampleFilters,
  sort: exampleImageQuerySort,
  page: 0,
  pageSize: 15,
};
const exampleImageQueryParamsJSON = JSON.stringify(exampleImageQueryParams);


export const endpointSettings: Record<MethodName, EndpointSettings> = {
  getStats: {
    methodName: 'getStats',
    remotePath: '/stats',
    exampleBody: '',
    schema: NoParamsSchema,
    description: 'no parameters',
  },
  getUsages: {
    methodName: 'getUsages',
    remotePath: '',
    exampleBody: '',
    schema: NoParamsSchema,
    description: 'no parameters',
  },
  getAllTags: {
    methodName: 'getAllTags',
    remotePath: '/images/tags',
    exampleBody: '',
    schema: NoParamsSchema,
    description: 'no parameters',
  },
  getGroupItemsByGroupId: {
    methodName: 'getGroupItemsByGroupId',
    remotePath: '/images/groupItemsByGroupId',
    exampleBody: `{"groupId": "", "includeGroups": true, "params": ${exampleImageQueryParamsJSON}}`,
    schema: GetGroupItemsByGroupIdParamsSchema,
    description: [
      'groupId: string',
      'includeGroups: boolean',
      'params.page: number (min: 0)',
      'params.pageSize: number (min: 0)',
      'params.filters: optional',
      'params.filters.tags: optional array of string | SpecialTags',
      'params.filters.palette: optional array of string',
      'params.filters.frame: optional array of string',
      'params.sort.field: \'created\' | \'frame\' | \'palette\' | \'title\'',
      'params.sort.direction: \'asc\' | \'desc\'',
    ].join('\n'),
  },
  getHashesByGroupId: {
    methodName: 'getHashesByGroupId',
    remotePath: '/images/hashesByGroupId',
    exampleBody: `{"groupId": "", "includeGroups": true, "sort": ${exampleImageQuerySortJSON}, "filters": ${exampleFiltersJSON}}`,
    schema: GetHashesByGroupIdParamsSchema,
    description: [
      'groupId: string',
      'includeGroups: boolean',
      'sort.field: \'created\' | \'frame\' | \'palette\' | \'title\'',
      'sort.direction: \'asc\' | \'desc\'',
      'filters: optional',
      'filters.tags: optional array of string | SpecialTags',
      'filters.palette: optional array of string',
      'filters.frame: optional array of string',
    ].join('\n'),
  },
  getImages: {
    methodName: 'getImages',
    remotePath: '/images',
    exampleBody: `{"params": ${exampleImageQueryParamsJSON}}`,
    schema: GetImagesParamsSchema,
    description: [
      'params.page: number (min: 0)',
      'params.pageSize: number (min: 0)',
      'params.filters: optional',
      'params.filters.tags: optional array of string | SpecialTags',
      'params.filters.palette: optional array of string',
      'params.filters.frame: optional array of string',
      'params.sort.field: \'created\' | \'frame\' | \'palette\' | \'title\'',
      'params.sort.direction: \'asc\' | \'desc\'',
      'candidateHashes: optional set of string',
    ].join('\n'),
  },
  getImagesByHashes: {
    methodName: 'getImagesByHashes',
    remotePath: '/images/byHashes',
    exampleBody: '{"hashes": []}',
    schema: GetImagesByHashesParamsSchema,
    description: 'hashes: array of string (min: 1)',
  },
  getImagesByAnyHashes: {
    methodName: 'getImagesByAnyHashes',
    remotePath: '/images/byAnyHashes',
    exampleBody: '{"hashes": []}',
    schema: GetImagesByAnyHashesParamsSchema,
    description: 'hashes: array of string (min: 1)',
  },
  updateImages: {
    methodName: 'updateImages',
        remotePath: '/images/update',

    exampleBody: '{"images": [], "purge": false}',
    schema: UpdateImagesParamsSchema,
    description: [
      'images: array of Image',
      'purge: boolean',
    ].join('\n'),
  },
  deleteImagesByHashes: {
    methodName: 'deleteImagesByHashes',
    remotePath: '/images/delete',
    exampleBody: '{"hashes": []}',
    schema: DeleteImagesByHashesParamsSchema,
    description: 'hashes: array of string (min: 1)',
  },
  getImageGroupsFullTree: {
    methodName: 'getImageGroupsFullTree',
    remotePath: '/imageGroups/tree',
    exampleBody: '',
    schema: NoParamsSchema,
    description: 'no parameters',
  },
  getImageGroupsList: {
    methodName: 'getImageGroupsList',
    remotePath: '/imageGroups/list',
    exampleBody: '',
    schema: NoParamsSchema,
    description: 'no parameters',
  },
  updateImageGroups: {
    methodName: 'updateImageGroups',
    remotePath: '/imageGroups/update',
    exampleBody: '{"imageGroups": [], "purge": false}',
    schema: UpdateImageGroupsParamsSchema,
    description: [
      'imageGroups: array of SerializableImageGroup',
      'purge: boolean',
    ].join('\n'),
  },
  deleteImageGroupsByIds: {
    methodName: 'deleteImageGroupsByIds',
    remotePath: '/imageGroups/delete',
    exampleBody: '{"ids": []}',
    schema: DeleteImageGroupsByIdsParamsSchema,
    description: 'ids: array of string (min: 1)',
  },
  getFrames: {
    methodName: 'getFrames',
    remotePath: '',
    exampleBody: '',
    schema: NoParamsSchema,
    description: 'no parameters',
  },
  getFramesByHashes: {
    methodName: 'getFramesByHashes',
    remotePath: '',
    exampleBody: '{"hashes": []}',
    schema: GetFramesByHashesParamsSchema,
    description: 'hashes: array of string (min: 1)',
  },
  getFramesByIds: {
    methodName: 'getFramesByIds',
    remotePath: '',
    exampleBody: '{"ids": []}',
    schema: GetFramesByIdsParamsSchema,
    description: 'ids: array of string (min: 1)',
  },
  updateFrames: {
    methodName: 'updateFrames',
    remotePath: '',
    exampleBody: '{"frames": [], "purge": false}',
    schema: UpdateFramesParamsSchema,
    description: [
      'frames: array of Frame',
      'purge: boolean',
    ].join('\n'),
  },
  deleteFramesByIds: {
    methodName: 'deleteFramesByIds',
    remotePath: '',
    exampleBody: '{"ids": []}',
    schema: DeleteFramesByIdsParamsSchema,
    description: 'ids: array of string (min: 1)',
  },
  getFrameGroups: {
    methodName: 'getFrameGroups',
    remotePath: '',
    exampleBody: '',
    schema: NoParamsSchema,
    description: 'no parameters',
  },
  updateFrameGroups: {
    methodName: 'updateFrameGroups',
    remotePath: '',
    exampleBody: '{"frameGroups": [], "purge": false}',
    schema: UpdateFrameGroupsParamsSchema,
    description: [
      'frameGroups: array of FrameGroup',
      'purge: boolean',
    ].join('\n'),
  },
  deleteFrameGroupsByIds: {
    methodName: 'deleteFrameGroupsByIds',
    remotePath: '',
    exampleBody: '{"ids": []}',
    schema: DeleteFrameGroupsByIdsParamsSchema,
    description: 'ids: array of string (min: 1)',
  },
  getPalettes: {
    methodName: 'getPalettes',
    remotePath: '',
    exampleBody: '',
    schema: NoParamsSchema,
    description: 'no parameters',
  },
  getPalettesByShortNames: {
    methodName: 'getPalettesByShortNames',
    remotePath: '',
    exampleBody: '{"shortNames": []}',
    schema: GetPalettesByShortNamesParamsSchema,
    description: 'shortNames: array of string (min: 1)',
  },
  updatePalettes: {
    methodName: 'updatePalettes',
    remotePath: '',
    exampleBody: '{"palettes": [], "purge": false}',
    schema: UpdatePalettesParamsSchema,
    description: [
      'palettes: array of Palette',
      'purge: boolean',
    ].join('\n'),
  },
  deletePalettesByShortNames: {
    methodName: 'deletePalettesByShortNames',
    remotePath: '',
    exampleBody: '{"shortNames": []}',
    schema: DeletePalettesByShortNamesParamsSchema,
    description: 'shortNames: array of string (min: 1)',
  },
  getPlugins: {
    methodName: 'getPlugins',
    remotePath: '',
    exampleBody: '',
    schema: NoParamsSchema,
    description: 'no parameters',
  },
  getPluginsByUrls: {
    methodName: 'getPluginsByUrls',
    remotePath: '',
    exampleBody: '{"urls": []}',
    schema: GetPluginsByUrlsParamsSchema,
    description: 'urls: array of string (min: 1)',
  },
  updatePlugins: {
    methodName: 'updatePlugins',
    remotePath: '',
    exampleBody: '{"plugins": [], "purge": false}',
    schema: UpdatePluginsParamsSchema,
    description: [
      'plugins: array of Plugin',
      'purge: boolean',
    ].join('\n'),
  },
  deletePluginsByUrls: {
    methodName: 'deletePluginsByUrls',
    remotePath: '',
    exampleBody: '{"urls": []}',
    schema: DeletePluginsByUrlsParamsSchema,
    description: 'urls: array of string (min: 1)',
  },
  getBinaryImagesByHashes: {
    methodName: 'getBinaryImagesByHashes',
    remotePath: '',
    exampleBody: '{"hashes": []}',
    schema: GetBinaryItemsByHashesParamsSchema,
    description: 'hashes: array of string (min: 1)',
  },
  getBinaryImageHashes: {
    methodName: 'getBinaryImageHashes',
    remotePath: '',
    exampleBody: '',
    schema: NoParamsSchema,
    description: 'no parameters',
  },
  updateBinaryImages: {
    methodName: 'updateBinaryImages',
    remotePath: '',
    exampleBody: '{"items": []}',
    schema: UpdateBinaryItemsParamsSchema,
    description: 'items: array of BinaryStoreItem (min: 1)',
  },
  deleteBinaryImagesByHashes: {
    methodName: 'deleteBinaryImagesByHashes',
    remotePath: '',
    exampleBody: '{"hashes": []}',
    schema: DeleteBinaryItemsByHashesParamsSchema,
    description: 'hashes: array of string (min: 1)',
  },
  getBinaryFramesByHashes: {
    methodName: 'getBinaryFramesByHashes',
    remotePath: '',
    exampleBody: '{"hashes": []}',
    schema: GetBinaryItemsByHashesParamsSchema,
    description: 'hashes: array of string (min: 1)',
  },
  getBinaryFrameHashes: {
    methodName: 'getBinaryFrameHashes',
    remotePath: '',
    exampleBody: '',
    schema: NoParamsSchema,
    description: 'no parameters',
  },
  updateBinaryFrames: {
    methodName: 'updateBinaryFrames',
    remotePath: '',
    exampleBody: '{"items": []}',
    schema: UpdateBinaryItemsParamsSchema,
    description: 'items: array of BinaryStoreItem (min: 1)',
  },
  deleteBinaryFramesByHashes: {
    methodName: 'deleteBinaryFramesByHashes',
    remotePath: '',
    exampleBody: '{"hashes": []}',
    schema: DeleteBinaryItemsByHashesParamsSchema,
    description: 'hashes: array of string (min: 1)',
  },
};

export const itemsSourceMethodNames = Object.keys(endpointSettings) as MethodName[];

type AssertExhaustive = Exclude<MethodName, (typeof itemsSourceMethodNames)[number]> extends never ? true : never;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _exhaustiveCheck: AssertExhaustive = true;
