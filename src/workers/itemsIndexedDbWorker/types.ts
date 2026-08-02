import { type DBSchema, type IDBPDatabase, type IDBPTransaction, type StoreNames } from 'idb';
import z from 'zod';
import { SpecialTags } from '@/consts/SpecialTags';
import { BinaryStoreItem } from '@/types/BinaryStoreItem';
import { type Frame } from '@/types/Frame';
import { type FrameGroup } from '@/types/FrameGroup';
import {
  type Image,
  type ImageMetadata,
} from '@/types/Image';
import {
  type SerializableImageGroup,
  type TreeImageGroup,
} from '@/types/ImageGroup';
import { type Palette } from '@/types/Palette';
import { type Plugin } from '@/types/Plugin';
import {
  GroupItemGroupSchema,
  GroupItemImageSchema,
  GroupItemSchema,
  StoredImageSchema,
  StoredSerializableImageGroupSchema,
  ItemsReferenceListSchema,
} from '@/workers/itemsIndexedDbWorker/schemas';

export type StoredImage = z.infer<typeof StoredImageSchema>;
export type StoredSerializableImageGroup = z.infer<typeof StoredSerializableImageGroupSchema>;
export type GroupItemImage = z.infer<typeof GroupItemImageSchema>;
export type GroupItemGroup = z.infer<typeof GroupItemGroupSchema>;
export type GroupItem = z.infer<typeof GroupItemSchema>;

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

export type SortDirection = 'asc' | 'desc';
export type ImageSortField = 'created' | 'frame' | 'palette' | 'title';

export interface ItemsHostApi {
  getLegacyStorage(): Promise<Record<string, unknown[]>>;
  onDataChanged(): void;
  onMigrationError(message: string): void;
}

export type AfterUpgradeFn =  (upgradedDatabase: IDBPDatabase<ItemsDB>, hostApi: ItemsHostApi) => Promise<void>;

export type MigrationFn = (
  db: IDBPDatabase<ItemsDB>,
  tx: IDBPTransaction<ItemsDB, StoreNames<ItemsDB>[], 'versionchange'>,
) => AfterUpgradeFn | null;

export interface ImageQueryFilters {
  tags?: (string | SpecialTags)[];
  palette?: string[];
  frame?: string[];
}

export interface ImageQuerySort {
  field: ImageSortField;
  direction: SortDirection;
}

export interface ImageQueryParams {
  page: number;
  pageSize: number;
  filters?: ImageQueryFilters;
  sort: ImageQuerySort;
}

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
  getGroupItemsByGroupId(groupId: string, includeGroups: boolean, params: ImageQueryParams): Promise<ItemsSourceResponse<GroupItem>>;
  getHashesByGroupId(groupId: string, includeGroupImageHashes: boolean, sort: ImageQuerySort, filters?: ImageQueryFilters): Promise<ItemsSourceTotalResponse<string>>;
  getImages(params: ImageQueryParams, candidateHashes?: Set<string>): Promise<ItemsSourceResponse<Image>>;
  getImagesByHashes(hashes: string[]): Promise<ItemsSourceResponse<Image>>;
  getImagesByAnyHashes(hashes: string[]): Promise<ItemsSourceResponse<ItemsReferenceList<Image>>>;
  updateImages(images: Image[], purge: boolean): Promise<void>;
  deleteImagesByHashes(hashes: string[]): Promise<void>;

  getImageGroupsFullTree(): Promise<RootItemSourceResponse<TreeImageGroup>>;
  getImageGroupsList(): Promise<ItemsSourceTotalResponse<SerializableImageGroup>>;
  updateImageGroups(imageGroups: SerializableImageGroup[], purge: boolean): Promise<void>;
  deleteImageGroupsByIds(ids: string[]): Promise<void>;

  getFrames(): Promise<ItemsSourceTotalResponse<Frame>>;
  getFramesByHashes(hashes: string[]): Promise<ItemsSourceTotalResponse<Frame>>;
  getFramesByIds(ids: string[]): Promise<ItemsSourceTotalResponse<Frame>>;
  updateFrames(frames: Frame[], purge: boolean): Promise<void>;
  deleteFramesByIds(ids: string[]): Promise<void>;

  getFrameGroups(): Promise<ItemsSourceTotalResponse<FrameGroup>>;
  updateFrameGroups(frameGroups: FrameGroup[], purge: boolean): Promise<void>;
  deleteFrameGroupsByIds(ids: string[]): Promise<void>;

  getPalettes() : Promise<ItemsSourceTotalResponse<Palette>>;
  getPalettesByShortNames(shortNames: string[]) : Promise<ItemsSourceResponse<Palette>>;
  updatePalettes(palettes: Palette[], purge: boolean): Promise<void>;
  deletePalettesByShortNames(shortNames: string[]): Promise<void>;

  getPlugins(): Promise<ItemsSourceTotalResponse<Plugin>>;
  getPluginsByUrls(urls: string[]): Promise<ItemsSourceResponse<Plugin>>;
  updatePlugins(plugins: Plugin[], purge: boolean): Promise<void>;
  deletePluginsByUrls(urls: string[]): Promise<void>;

  getBinaryImagesByHashes(hashes: string[]): Promise<ItemsSourceResponse<BinaryStoreItem>>;
  getBinaryImageHashes(): Promise<ItemsSourceTotalResponse<string>>;
  updateBinaryImages(binaryImages: BinaryStoreItem[]): Promise<void>;
  deleteBinaryImagesByHashes(hashes: string[]): Promise<void>;

  getBinaryFramesByHashes(hashes: string[]): Promise<ItemsSourceResponse<BinaryStoreItem>>;
  getBinaryFrameHashes(): Promise<ItemsSourceTotalResponse<string>>;
  updateBinaryFrames(binaryFrames: BinaryStoreItem[]): Promise<void>;
  deleteBinaryFramesByHashes(hashes: string[]): Promise<void>;
}

export interface FilterableFacet {
  hash: string | null;
  tags: string[];
  specialTags: SpecialTags[];
  created: string;
  palette: string | null;
  frame: string | null;
  type: 'mono' | 'rgbn' | null;
  meta: ImageMetadata | null;
}
