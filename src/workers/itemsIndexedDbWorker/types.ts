import { type DBSchema, type IDBPDatabase, type IDBPTransaction, type StoreNames } from 'idb';
import z from 'zod';
import { SpecialTags } from '@/consts/SpecialTags';
import { type Frame } from '@/types/Frame';
import { type FrameGroup } from '@/types/FrameGroup';
import {
  type Image,
  ImageSchema,
  MonochromeImageSchema,
  RGBNImageSchema,
} from '@/types/Image';
import {
  type NewSerializableImageGroup,
  NewSerializableImageGroupSchema,
  type NewTreeImageGroup,
} from '@/types/ImageGroup';
import { type Palette } from '@/types/Palette';
import { type Plugin } from '@/types/Plugin';

export const StoredImageSchema = z.discriminatedUnion('type', [
  MonochromeImageSchema,
  RGBNImageSchema,
]).transform((image) => ({
  ...image,
  referencedHashes: image.type === 'rgbn'
    ? Object.values(image.hashes ?? {}).filter((h): h is string => Boolean(h))
    : [],
}));

export type StoredImage = z.infer<typeof StoredImageSchema>;

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
      created: string;
      frame: string;
      palette: string;
      tags: string;
      referencedHashes: string;
      title: string;
      type: string;
    };
  };
  imagegroups: {
    key: string;
    value: NewSerializableImageGroup;
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
  getRecentImports(): Promise<Set<string>>;
  onDataChanged(): void;
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

export const GroupItemSchema = z.object({
  image: ImageSchema,
  group: NewSerializableImageGroupSchema.nullable(),
  title: z.string(),
  created: z.string(),
  frame: z.string().nullable(),
  palette: z.string().nullable(),
});

export type GroupItem = z.infer<typeof GroupItemSchema>;

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

export const ItemsReferenceListSchema = <T extends z.ZodType>(itemSchema: T) => {
  return z.object({
    reference: z.string(),
    items: z.array(itemSchema),
  });
};

export interface ItemsReferenceList<T> {
  reference: string;
  items: T[];
}

export interface RootItemSourceResponse<T> {
  item: T;
  totalCount: number;
  duration: number;
}

export interface ItemsSource {
  init(hostApi: ItemsHostApi): void;
  getFrameDataByHashes(hashes: string[]): Promise<string[]>;
  getImageDataByHashes(hashes: string[]): Promise<string[]>;

  getAllTags(): Promise<ItemsSourceResponse<string>>;
  getGroupItemsByGroupId(groupId: string, params: ImageQueryParams): Promise<ItemsSourceResponse<GroupItem>>;
  getImages(params: ImageQueryParams): Promise<ItemsSourceResponse<Image>>;
  getImagesByHashes(hashes: string[]): Promise<ItemsSourceResponse<Image>>;
  getImagesByAnyHashes(hashes: string[]): Promise<ItemsSourceResponse<ItemsReferenceList<Image>>>;
  updateImages(images: Image[], purge: boolean): Promise<void>;
  deleteImagesByHashes(hashes: string[]): Promise<void>;

  getImageGroupsFullTree(): Promise<RootItemSourceResponse<NewTreeImageGroup>>;
  getImageGroupsList(): Promise<ItemsSourceResponse<NewSerializableImageGroup>>;
  updateImageGroups(imageGroups: NewSerializableImageGroup[], purge: boolean): Promise<void>;
  deleteImageGroupsByIds(ids: string[]): Promise<void>;

  getFrames(): Promise<ItemsSourceResponse<Frame>>;
  getFramesByHashes(hashes: string[]): Promise<ItemsSourceResponse<Frame>>;
  getFramesByIds(ids: string[]): Promise<ItemsSourceResponse<Frame>>;
  updateFrames(frames: Frame[], purge: boolean): Promise<void>;
  deleteFramesByIds(ids: string[]): Promise<void>;

  getFrameGroups(): Promise<ItemsSourceResponse<FrameGroup>>;
  updateFrameGroups(frameGroups: FrameGroup[], purge: boolean): Promise<void>;
  deleteFrameGroupsByIds(ids: string[]): Promise<void>;

  getPalettes() : Promise<ItemsSourceResponse<Palette>>;
  getPalettesByShortNames(shortNames: string[]) : Promise<ItemsSourceResponse<Palette>>;
  updatePalettes(palettes: Palette[], purge: boolean): Promise<void>;
  deletePalettesByShortNames(shortNames: string[]): Promise<void>;

  getPlugins(): Promise<ItemsSourceResponse<Plugin>>;
  getPluginsByUrls(urls: string[]): Promise<ItemsSourceResponse<Plugin>>;
  updatePlugins(plugins: Plugin[], purge: boolean): Promise<void>;
  deletePluginsByUrls(urls: string[]): Promise<void>;
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
