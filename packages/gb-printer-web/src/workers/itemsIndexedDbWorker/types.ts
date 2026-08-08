import { type Palette , type Image } from 'gb-printer-schemas';
import {
  type SerializableImageGroup,
  type TreeImageGroup,
} from 'gb-printer-schemas';
import { type Frame } from 'gb-printer-schemas';
import { type FrameGroup } from 'gb-printer-schemas';
import { type Plugin } from 'gb-printer-schemas';
import { type DBSchema, type IDBPDatabase, type IDBPTransaction, type StoreNames } from 'idb';
import z from 'zod';
import { SpecialTags } from '@/consts/SpecialTags';
import { BinaryStoreItem } from '@/types/BinaryStoreItem';
import {
  DeleteBinaryItemsByHashesParamsSchema,
  DeleteFrameGroupsByIdsParamsSchema,
  DeleteFramesByIdsParamsSchema,
  DeleteImageGroupsByIdsParamsSchema,
  DeleteImagesByHashesParamsSchema,
  DeletePalettesByShortNamesParamsSchema,
  DeletePluginsByUrlsParamsSchema,
  GetBinaryItemsByHashesParamsSchema,
  GetFramesByHashesParamsSchema,
  GetFramesByIdsParamsSchema,
  GetGroupItemsByGroupIdParamsSchema,
  GetHashesByGroupIdParamsSchema,
  GetImagesByAnyHashesParamsSchema,
  GetImagesByHashesParamsSchema,
  GetImagesParamsSchema,
  GetPalettesByShortNamesParamsSchema,
  GetPluginsByUrlsParamsSchema,
  GroupItemGroupSchema,
  GroupItemImageSchema,
  GroupItemSchema,
  ImageQueryFiltersSchema,
  ImageQueryParamsSchema,
  ImageQuerySortSchema,
  ItemsReferenceListSchema,
  StoredImageSchema,
  StoredSerializableImageGroupSchema,
  UpdateBinaryItemsParamsSchema,
  UpdateFrameGroupsParamsSchema,
  UpdateFramesParamsSchema,
  UpdateImageGroupsParamsSchema,
  UpdateImagesParamsSchema,
  UpdatePalettesParamsSchema,
  UpdatePluginsParamsSchema,
} from '@/workers/itemsIndexedDbWorker/schemas';

export type StoredImage = z.infer<typeof StoredImageSchema>;
export type StoredSerializableImageGroup = z.infer<typeof StoredSerializableImageGroupSchema>;
export type GroupItemImage = z.infer<typeof GroupItemImageSchema>;
export type GroupItemGroup = z.infer<typeof GroupItemGroupSchema>;
export type GroupItem = z.infer<typeof GroupItemSchema>;
export type ImageQueryFilters = z.infer<typeof ImageQueryFiltersSchema>;
export type ImageQuerySort = z.infer<typeof ImageQuerySortSchema>;
export type ImageQueryParams = z.infer<typeof ImageQueryParamsSchema>;
export type GetGroupItemsByGroupIdParams = z.infer<typeof GetGroupItemsByGroupIdParamsSchema>;
export type GetHashesByGroupIdParams = z.infer<typeof GetHashesByGroupIdParamsSchema>;
export type GetImagesParams = z.infer<typeof GetImagesParamsSchema>;
export type GetImagesByHashesParams = z.infer<typeof GetImagesByHashesParamsSchema>;
export type GetImagesByAnyHashesParams = z.infer<typeof GetImagesByAnyHashesParamsSchema>;
export type UpdateImagesParams = z.infer<typeof UpdateImagesParamsSchema>;
export type DeleteImagesByHashesParams = z.infer<typeof DeleteImagesByHashesParamsSchema>;
export type UpdateImageGroupsParams = z.infer<typeof UpdateImageGroupsParamsSchema>;
export type DeleteImageGroupsByIdsParams = z.infer<typeof DeleteImageGroupsByIdsParamsSchema>;
export type GetFramesByHashesParams = z.infer<typeof GetFramesByHashesParamsSchema>;
export type GetFramesByIdsParams = z.infer<typeof GetFramesByIdsParamsSchema>;
export type UpdateFramesParams = z.infer<typeof UpdateFramesParamsSchema>;
export type DeleteFramesByIdsParams = z.infer<typeof DeleteFramesByIdsParamsSchema>;
export type UpdateFrameGroupsParams = z.infer<typeof UpdateFrameGroupsParamsSchema>;
export type DeleteFrameGroupsByIdsParams = z.infer<typeof DeleteFrameGroupsByIdsParamsSchema>;
export type GetPalettesByShortNamesParams = z.infer<typeof GetPalettesByShortNamesParamsSchema>;
export type UpdatePalettesParams = z.infer<typeof UpdatePalettesParamsSchema>;
export type DeletePalettesByShortNamesParams = z.infer<typeof DeletePalettesByShortNamesParamsSchema>;
export type GetPluginsByUrlsParams = z.infer<typeof GetPluginsByUrlsParamsSchema>;
export type UpdatePluginsParams = z.infer<typeof UpdatePluginsParamsSchema>;
export type DeletePluginsByUrlsParams = z.infer<typeof DeletePluginsByUrlsParamsSchema>;
export type GetBinaryItemsByHashesParams = z.infer<typeof GetBinaryItemsByHashesParamsSchema>;
export type UpdateBinaryItemsParams = z.infer<typeof UpdateBinaryItemsParamsSchema>;
export type DeleteBinaryItemsByHashesParams = z.infer<typeof DeleteBinaryItemsByHashesParamsSchema>;

export interface ItemsDB extends DBSchema {
  binaryframes: {
    key: string;
    value: string;
  };
  binaryimages: {
    key: string;
    value: string;
  };
  frames: {
    key: string;
    value: Frame;
    indexes: {
      hash: string;
    };
  };
  framegroups: {
    key: string;
    value: FrameGroup;
  };
  images: {
    key: string;
    value: StoredImage;
    indexes: {
      tags: string;
      referencedHashes: string;
    };
  };
  imagegroups: {
    key: string;
    value: StoredSerializableImageGroup;
  };
  palettes: {
    key: string;
    value: Palette;
  };
  plugins: {
    key: string;
    value: Plugin;
  };
}


export interface ItemsHostApi {
  getLegacyStorage(): Promise<Record<string, unknown[]>>;
  onMigrationError(message: string): void;
}

export type AfterUpgradeFn =  (upgradedDatabase: IDBPDatabase<ItemsDB>, hostApi: ItemsHostApi) => Promise<void>;

export type MigrationFn = (
  db: IDBPDatabase<ItemsDB>,
  tx: IDBPTransaction<ItemsDB, StoreNames<ItemsDB>[], 'versionchange'>,
) => AfterUpgradeFn | null;

export interface ItemsSourcePaging {
  filtered: number;
  total: number;
  page: number;
  pageSize: number;
  maxPageIndex: number;
}

export interface ItemsSourceResponse<T> {
  items: T[];
  paging: ItemsSourcePaging;
  duration: number;
}

export interface ItemsSourceTotalResponse<T> {
  items: T[];
  total: number;
  duration: number;
}

export type ItemsReferenceList<T> = z.infer<ReturnType<typeof ItemsReferenceListSchema<z.ZodType<T>>>>;

export interface RootItemSourceResponse<T> {
  item: T;
  totalCount: number;
  duration: number;
}

export interface ItemsStatsTotals {
  palettes: number;
  plugins: number;
  frames: number;
  frameGroups: number;
  images: number;
  imageGroups: number;
  binaryImages: number;
  binaryFrames: number;
}

export interface ItemsStatsResponse {
  totals: ItemsStatsTotals;
  duration: number;
}

export interface PaletteUsage {
  shortName: string;
  usage: number;
}

export interface FrameUsage {
  id: string;
  usage: number;
}

export interface ItemsUsageTotals {
  palettes: PaletteUsage[];
  frames: FrameUsage[];
}

export interface ItemsUsageReponse {
  totals: ItemsUsageTotals;
  duration: number;
}

export interface ItemsSource {
  init(hostApi: ItemsHostApi): void;
  debugReset(): Promise<void>;
  runMaintenance(): Promise<void>;
  getStats(): Promise<ItemsStatsResponse>;
  getUsages(): Promise<ItemsUsageReponse>;

  getAllTags(): Promise<ItemsSourceTotalResponse<string>>;
  getGroupItemsByGroupId(params: GetGroupItemsByGroupIdParams): Promise<ItemsSourceResponse<GroupItem>>;
  getHashesByGroupId(params: GetHashesByGroupIdParams): Promise<ItemsSourceTotalResponse<string>>;
  getImages(params: GetImagesParams): Promise<ItemsSourceResponse<Image>>;
  getImagesByHashes(params: GetImagesByHashesParams): Promise<ItemsSourceResponse<Image>>;
  getImagesByAnyHashes(params: GetImagesByAnyHashesParams): Promise<ItemsSourceResponse<ItemsReferenceList<Image>>>;
  updateImages(params: UpdateImagesParams): Promise<void>;
  deleteImagesByHashes(params: DeleteImagesByHashesParams): Promise<void>;

  getImageGroupsFullTree(): Promise<RootItemSourceResponse<TreeImageGroup>>;
  getImageGroupsList(): Promise<ItemsSourceTotalResponse<SerializableImageGroup>>;
  updateImageGroups(params: UpdateImageGroupsParams): Promise<void>;
  deleteImageGroupsByIds(params: DeleteImageGroupsByIdsParams): Promise<void>;

  getFrames(): Promise<ItemsSourceTotalResponse<Frame>>;
  getFramesByHashes(params: GetFramesByHashesParams): Promise<ItemsSourceTotalResponse<Frame>>;
  getFramesByIds(params: GetFramesByIdsParams): Promise<ItemsSourceTotalResponse<Frame>>;
  updateFrames(params: UpdateFramesParams): Promise<void>;
  deleteFramesByIds(params: DeleteFramesByIdsParams): Promise<void>;

  getFrameGroups(): Promise<ItemsSourceTotalResponse<FrameGroup>>;
  updateFrameGroups(params: UpdateFrameGroupsParams): Promise<void>;
  deleteFrameGroupsByIds(params: DeleteFrameGroupsByIdsParams): Promise<void>;

  getPalettes() : Promise<ItemsSourceTotalResponse<Palette>>;
  getPalettesByShortNames(params: GetPalettesByShortNamesParams) : Promise<ItemsSourceResponse<Palette>>;
  updatePalettes(params: UpdatePalettesParams): Promise<void>;
  deletePalettesByShortNames(params: DeletePalettesByShortNamesParams): Promise<void>;

  getPlugins(): Promise<ItemsSourceTotalResponse<Plugin>>;
  getPluginsByUrls(params: GetPluginsByUrlsParams): Promise<ItemsSourceResponse<Plugin>>;
  updatePlugins(params: UpdatePluginsParams): Promise<void>;
  deletePluginsByUrls(params: DeletePluginsByUrlsParams): Promise<void>;

  getBinaryImagesByHashes(params: GetBinaryItemsByHashesParams): Promise<ItemsSourceResponse<BinaryStoreItem>>;
  getBinaryImageHashes(): Promise<ItemsSourceTotalResponse<string>>;
  updateBinaryImages(params: UpdateBinaryItemsParams): Promise<void>;
  deleteBinaryImagesByHashes(params: DeleteBinaryItemsByHashesParams): Promise<void>;

  getBinaryFramesByHashes(params: GetBinaryItemsByHashesParams): Promise<ItemsSourceResponse<BinaryStoreItem>>;
  getBinaryFrameHashes(): Promise<ItemsSourceTotalResponse<string>>;
  updateBinaryFrames(params: UpdateBinaryItemsParams): Promise<void>;
  deleteBinaryFramesByHashes(params: DeleteBinaryItemsByHashesParams): Promise<void>;
}

export interface FilterableFacet {
  tags: string[];
  specialTags: SpecialTags[];
  palettes: string[];
  frames: string[];
}
