import { EndpointUrls } from 'gb-items-db/src/endpointUrls';
import { ItemsSource } from 'gb-items-source';
import {
  GetGroupItemsByGroupIdParamsSchema,
  GetHashesByGroupIdParamsSchema,
  GetImagesParamsSchema,
  GetImagesByHashesParamsSchema,
  UpdateImagesParamsSchema,
  DeleteImagesByHashesParamsSchema,
  UpdateImageGroupsParamsSchema,
  DeleteImageGroupsByIdsParamsSchema,
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
    remotePath: EndpointUrls.GET_STATS,
    exampleBody: '',
    schema: NoParamsSchema,
    description: 'no parameters',
  },
  getUsages: {
    methodName: 'getUsages',
    remotePath: EndpointUrls.GET_USAGES,
    exampleBody: '',
    schema: NoParamsSchema,
    description: 'no parameters',
  },
  getAllTags: {
    methodName: 'getAllTags',
    remotePath: EndpointUrls.POST_IMAGES_TAGS,
    exampleBody: '',
    schema: NoParamsSchema,
    description: 'no parameters',
  },
  getGroupItemsByGroupId: {
    methodName: 'getGroupItemsByGroupId',
    remotePath: EndpointUrls.POST_IMAGES_GROUPITEMSBYGROUPID,
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
    remotePath: EndpointUrls.POST_IMAGES_HASHESBYGROUPID,
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
    remotePath: EndpointUrls.POST_IMAGES,
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
    remotePath: EndpointUrls.POST_IMAGES_BYHASHES,
    exampleBody: '{"hashes": []}',
    schema: GetImagesByHashesParamsSchema,
    description: 'hashes: array of string (min: 1)',
  },
  updateImages: {
    methodName: 'updateImages',
    remotePath: EndpointUrls.POST_IMAGES_UPDATE,
    exampleBody: '{"images": [], "purge": false}',
    schema: UpdateImagesParamsSchema,
    description: [
      'images: array of Image',
      'purge: boolean',
    ].join('\n'),
  },
  deleteImagesByHashes: {
    methodName: 'deleteImagesByHashes',
    remotePath: EndpointUrls.POST_IMAGES_DELETE,
    exampleBody: '{"hashes": []}',
    schema: DeleteImagesByHashesParamsSchema,
    description: 'hashes: array of string (min: 1)',
  },
  getImageGroupsFullTree: {
    methodName: 'getImageGroupsFullTree',
    remotePath: EndpointUrls.POST_IMAGEGROUPS_TREE,
    exampleBody: '',
    schema: NoParamsSchema,
    description: 'no parameters',
  },
  getImageGroupsList: {
    methodName: 'getImageGroupsList',
    remotePath: EndpointUrls.POST_IMAGEGROUPS_LIST,
    exampleBody: '',
    schema: NoParamsSchema,
    description: 'no parameters',
  },
  updateImageGroups: {
    methodName: 'updateImageGroups',
    remotePath: EndpointUrls.POST_IMAGEGROUPS_UPDATE,
    exampleBody: '{"imageGroups": [], "purge": false}',
    schema: UpdateImageGroupsParamsSchema,
    description: [
      'imageGroups: array of SerializableImageGroup',
      'purge: boolean',
    ].join('\n'),
  },
  deleteImageGroupsByIds: {
    methodName: 'deleteImageGroupsByIds',
    remotePath: EndpointUrls.POST_IMAGEGROUPS_DELETE,
    exampleBody: '{"ids": []}',
    schema: DeleteImageGroupsByIdsParamsSchema,
    description: 'ids: array of string (min: 1)',
  },
  getFrames: {
    methodName: 'getFrames',
    remotePath: EndpointUrls.POST_FRAMES,
    exampleBody: '',
    schema: NoParamsSchema,
    description: 'no parameters',
  },
  getFramesByIds: {
    methodName: 'getFramesByIds',
    remotePath: EndpointUrls.POST_FRAMES_BYIDS,
    exampleBody: '{"ids": []}',
    schema: GetFramesByIdsParamsSchema,
    description: 'ids: array of string (min: 1)',
  },
  updateFrames: {
    methodName: 'updateFrames',
    remotePath: EndpointUrls.POST_FRAMES_UPDATE,
    exampleBody: '{"frames": [], "purge": false}',
    schema: UpdateFramesParamsSchema,
    description: [
      'frames: array of Frame',
      'purge: boolean',
    ].join('\n'),
  },
  deleteFramesByIds: {
    methodName: 'deleteFramesByIds',
    remotePath: EndpointUrls.POST_FRAMES_DELETE,
    exampleBody: '{"ids": []}',
    schema: DeleteFramesByIdsParamsSchema,
    description: 'ids: array of string (min: 1)',
  },
  getFrameGroups: {
    methodName: 'getFrameGroups',
    remotePath: EndpointUrls.POST_FRAMEGROUPS,
    exampleBody: '',
    schema: NoParamsSchema,
    description: 'no parameters',
  },
  updateFrameGroups: {
    methodName: 'updateFrameGroups',
    remotePath: EndpointUrls.POST_FRAMEGROUPS_UPDATE,
    exampleBody: '{"frameGroups": [], "purge": false}',
    schema: UpdateFrameGroupsParamsSchema,
    description: [
      'frameGroups: array of FrameGroup',
      'purge: boolean',
    ].join('\n'),
  },
  deleteFrameGroupsByIds: {
    methodName: 'deleteFrameGroupsByIds',
    remotePath: EndpointUrls.POST_FRAMEGROUPS_DELETE,
    exampleBody: '{"ids": []}',
    schema: DeleteFrameGroupsByIdsParamsSchema,
    description: 'ids: array of string (min: 1)',
  },
  getPalettes: {
    methodName: 'getPalettes',
    remotePath: EndpointUrls.POST_PALETTES,
    exampleBody: '',
    schema: NoParamsSchema,
    description: 'no parameters',
  },
  getPalettesByShortNames: {
    methodName: 'getPalettesByShortNames',
    remotePath: EndpointUrls.POST_PALETTES_BYSHORTNAMES,
    exampleBody: '{"shortNames": []}',
    schema: GetPalettesByShortNamesParamsSchema,
    description: 'shortNames: array of string (min: 1)',
  },
  updatePalettes: {
    methodName: 'updatePalettes',
    remotePath: EndpointUrls.POST_PALETTES_UPDATE,
    exampleBody: '{"palettes": [], "purge": false}',
    schema: UpdatePalettesParamsSchema,
    description: [
      'palettes: array of Palette',
      'purge: boolean',
    ].join('\n'),
  },
  deletePalettesByShortNames: {
    methodName: 'deletePalettesByShortNames',
    remotePath: EndpointUrls.POST_PALETTES_DELETE,
    exampleBody: '{"shortNames": []}',
    schema: DeletePalettesByShortNamesParamsSchema,
    description: 'shortNames: array of string (min: 1)',
  },
  getPlugins: {
    methodName: 'getPlugins',
    remotePath: EndpointUrls.POST_PLUGINS,
    exampleBody: '',
    schema: NoParamsSchema,
    description: 'no parameters',
  },
  getPluginsByUrls: {
    methodName: 'getPluginsByUrls',
    remotePath: EndpointUrls.POST_PLUGINS_BYURLS,
    exampleBody: '{"urls": []}',
    schema: GetPluginsByUrlsParamsSchema,
    description: 'urls: array of string (min: 1)',
  },
  updatePlugins: {
    methodName: 'updatePlugins',
    remotePath: EndpointUrls.POST_PLUGINS_UPDATE,
    exampleBody: '{"plugins": [], "purge": false}',
    schema: UpdatePluginsParamsSchema,
    description: [
      'plugins: array of Plugin',
      'purge: boolean',
    ].join('\n'),
  },
  deletePluginsByUrls: {
    methodName: 'deletePluginsByUrls',
    remotePath: EndpointUrls.POST_PLUGINS_DELETE,
    exampleBody: '{"urls": []}',
    schema: DeletePluginsByUrlsParamsSchema,
    description: 'urls: array of string (min: 1)',
  },
  getBinaryImagesByHashes: {
    methodName: 'getBinaryImagesByHashes',
    remotePath: EndpointUrls.POST_BINARYIMAGES_BYHASHES,
    exampleBody: '{"hashes": []}',
    schema: GetBinaryItemsByHashesParamsSchema,
    description: 'hashes: array of string (min: 1)',
  },
  getBinaryImageHashes: {
    methodName: 'getBinaryImageHashes',
    remotePath: EndpointUrls.POST_BINARYIMAGES_HASHES,
    exampleBody: '',
    schema: NoParamsSchema,
    description: 'no parameters',
  },
  getOrphanedImageHashes: {
    methodName: 'getOrphanedImageHashes',
    remotePath: EndpointUrls.POST_BINARYIMAGES_ORPHANED,
    exampleBody: '',
    schema: NoParamsSchema,
    description: 'no parameters',
  },
  updateBinaryImages: {
    methodName: 'updateBinaryImages',
    remotePath: EndpointUrls.POST_BINARYIMAGES_UPDATE,
    exampleBody: '{"items": []}',
    schema: UpdateBinaryItemsParamsSchema,
    description: 'items: array of BinaryStoreItem (min: 1)',
  },
  deleteBinaryImagesByHashes: {
    methodName: 'deleteBinaryImagesByHashes',
    remotePath: EndpointUrls.POST_BINARYIMAGES_DELETE,
    exampleBody: '{"hashes": []}',
    schema: DeleteBinaryItemsByHashesParamsSchema,
    description: 'hashes: array of string (min: 1)',
  },
  getBinaryFramesByHashes: {
    methodName: 'getBinaryFramesByHashes',
    remotePath: EndpointUrls.POST_BINARYFRAMES_BYHASHES,
    exampleBody: '{"hashes": []}',
    schema: GetBinaryItemsByHashesParamsSchema,
    description: 'hashes: array of string (min: 1)',
  },
  getBinaryFrameHashes: {
    methodName: 'getBinaryFrameHashes',
    remotePath: EndpointUrls.POST_BINARYFRAMES_HASHES,
    exampleBody: '',
    schema: NoParamsSchema,
    description: 'no parameters',
  },
  getOrphanedFrameHashes: {
    methodName: 'getOrphanedFrameHashes',
    remotePath: EndpointUrls.POST_BINARYFRAMES_ORPHANED,
    exampleBody: '',
    schema: NoParamsSchema,
    description: 'no parameters',
  },
  updateBinaryFrames: {
    methodName: 'updateBinaryFrames',
    remotePath: EndpointUrls.POST_BINARYFRAMES_UPDATE,
    exampleBody: '{"items": []}',
    schema: UpdateBinaryItemsParamsSchema,
    description: 'items: array of BinaryStoreItem (min: 1)',
  },
  deleteBinaryFramesByHashes: {
    methodName: 'deleteBinaryFramesByHashes',
    remotePath: EndpointUrls.POST_BINARYFRAMES_DELETE,
    exampleBody: '{"hashes": []}',
    schema: DeleteBinaryItemsByHashesParamsSchema,
    description: 'hashes: array of string (min: 1)',
  },
};

export const itemsSourceMethodNames = Object.keys(endpointSettings) as MethodName[];

type AssertExhaustive = Exclude<MethodName, (typeof itemsSourceMethodNames)[number]> extends never ? true : never;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _exhaustiveCheck: AssertExhaustive = true;
