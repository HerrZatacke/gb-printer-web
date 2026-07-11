import { type DBSchema, type IDBPDatabase, type IDBPTransaction, type StoreNames } from 'idb';
import { SpecialTags } from '@/consts/SpecialTags';
import { type Frame } from '@/types/Frame';
import { type FrameGroup } from '@/types/FrameGroup';
import { type Image } from '@/types/Image';
import { type SerializableImageGroup } from '@/types/ImageGroup';
import { type Palette } from '@/types/Palette';
import { type Plugin } from '@/types/Plugin';

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
      name: string;
    };
  };
  framegroups: {
    key: string;
    value: FrameGroup;
  };
  images: {
    key: string;
    value: Image;
    indexes: {
      created: string;
      frame: string;
      palette: string;
      tags: string;
      title: string;
      type: string;
    };
  };
  imagegroups: {
    key: string;
    value: SerializableImageGroup;
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

type SortDirection = 'asc' | 'desc';
type ImageSortField = 'created' | 'frame' | 'palette' | 'title';

export interface ItemsHostApi {
  getLegacyStorage(): Promise<Record<string, unknown[]>>;
  getRecentImports(): Promise<Set<string>>;
  onDataChanged(): void;
}

export type AfterUpgradeFn =  (upgradedDatabase: IDBPDatabase<ItemsDB>, hostApi: ItemsHostApi) => Promise<void>;

export type MigrationFn = (
  db: IDBPDatabase<ItemsDB>,
  tx: IDBPTransaction<ItemsDB, StoreNames<ItemsDB>[], 'versionchange'>,
) => AfterUpgradeFn | null;

export interface GetImagesFilters {
  tags?: (string | SpecialTags)[];
  palette?: string[];
  frame?: string[];
}

export interface GetImagesSort {
  field: ImageSortField;
  direction: SortDirection;
}

export interface GetImagesParams {
  page: number;
  pageSize: number;
  filters?: GetImagesFilters;
  sort: GetImagesSort;
}

export interface ItemsSourcePaging {
  filtered: number;
  total: number;
  page: number;
  pageSize: number;
}

export interface ItemsSourceResponse<T> {
  items: T[];
  paging: ItemsSourcePaging;
}

export interface ItemsSource {
  init(hostApi: ItemsHostApi): void;
  getFrameDataByHashes(hashes: string[]): Promise<string[]>;
  getImageDataByHashes(hashes: string[]): Promise<string[]>;

  getImages(params: GetImagesParams): Promise<ItemsSourceResponse<Image>>;
  getImagesByHashes(hashes: string[]): Promise<ItemsSourceResponse<Image>>;

  getImageGroups(): Promise<ItemsSourceResponse<SerializableImageGroup>>;

  getFrames(): Promise<ItemsSourceResponse<Frame>>;
  getFramesByIds(ids: string[]): Promise<ItemsSourceResponse<Frame>>;
  // getFramesByGroup(groupId: string): Promise<ItemsSourceResponse<Frame>>;

  getFrameGroups(): Promise<ItemsSourceResponse<FrameGroup>>;

  getPalettes() : Promise<ItemsSourceResponse<Palette>>;
  getPalettesByShortNames(shortNames: string[]) : Promise<ItemsSourceResponse<Palette>>;
  updatePalettes(palettes: Palette[]): Promise<void>;
  deletePalettesByShortNames(shortNames: string[]): Promise<void>;

  getPlugins(): Promise<ItemsSourceResponse<Plugin>>;
  getPluginsByUrls(urls: string[]): Promise<ItemsSourceResponse<Plugin>>;
}

export type FilterStep =
  // regular filter
  { kind: 'indexAny'; indexName: string; values: string[] } |
  // e.g. "has no tags"
  { kind: 'indexNone'; indexName: string } |
  // e.g. searching for newest
  { kind: 'indexRange'; indexName: 'created'; range: IDBKeyRange } |
  // e.g. "recent imports" list
  { kind: 'ids'; ids: Set<string> } |
  // e.g. check for hascomments/hasusername
  { kind: 'predicate'; test: (image: Image) => boolean };
