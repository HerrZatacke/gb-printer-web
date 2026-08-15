import {
  type BinaryStoreItem,
  type DeleteBinaryItemsByHashesParams,
  type DeleteFrameGroupsByIdsParams,
  type DeleteFramesByIdsParams,
  type DeleteImageGroupsByIdsParams,
  type DeleteImagesByHashesParams,
  type DeletePalettesByShortNamesParams,
  type DeletePluginsByUrlsParams,
  type Frame,
  type FrameGroup,
  type GetBinaryItemsByHashesParams,
  type GetFramesByHashesParams,
  type GetFramesByIdsParams,
  type GetGroupItemsByGroupIdParams,
  type GetHashesByGroupIdParams,
  type GetImagesByAnyHashesParams,
  type GetImagesByHashesParams,
  type GetImagesParams,
  type GetPalettesByShortNamesParams,
  type GetPluginsByUrlsParams,
  type GroupItem,
  type Image,
  type ItemsReferenceList,
  type ItemsSourceResponse,
  type ItemsSourceTotalResponse,
  type ItemsStatsResponse,
  type ItemsUsageReponse,
  type Palette,
  type Plugin,
  type RootItemSourceResponse,
  type SerializableImageGroup,
  type SpecialTags,
  type StoredImage,
  type StoredSerializableImageGroup,
  type TreeImageGroup,
  type UpdateBinaryItemsParams,
  type UpdateFrameGroupsParams,
  type UpdateFramesParams,
  type UpdateImageGroupsParams,
  type UpdateImagesParams,
  type UpdatePalettesParams,
  type UpdatePluginsParams,
} from 'gb-printer-schemas';
import { type DBSchema, type IDBPDatabase, type IDBPTransaction, type StoreNames } from 'idb';
import { type PreparedDb } from '@/workers/itemsIndexedDbWorker/db';

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

export interface ItemsSource {
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

export interface WithDb {
  db: PreparedDb;
}

export type ItemsSourceInternal = ItemsSource & WithDb;

export interface FilterableFacet {
  tags: string[];
  specialTags: SpecialTags[];
  palettes: string[];
  frames: string[];
}

export type InitWorkerFn = (hostApi: ItemsHostApi) => Promise<ItemsSource>;
