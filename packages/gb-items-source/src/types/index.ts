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

export interface FilterableFacet {
  tags: string[];
  specialTags: SpecialTags[];
  palettes: string[];
  frames: string[];
}

export const StoreNames = {
  IMAGES: 'images',
  FRAMES: 'frames',
  FRAMEGROUPS: 'framegroups',
  IMAGEGROUPS: 'imagegroups',
  PALETTES: 'palettes',
  PLUGINS: 'plugins',
  BINARYIMAGES: 'binaryimages',
  BINARYFRAMES: 'binaryframes',
} as const;
export type StoreNames = (typeof StoreNames)[keyof typeof StoreNames];

export interface RepositoryEntry<TValue, TKey extends string = string> {
  key: TKey;
  value: TValue;
}

export interface ItemRepository<TValue, TKey extends string = string> {
  count(): Promise<number>;
  getAll(): Promise<TValue[]>;
  getAllKeys(): Promise<TKey[]>;
  getByKey(key: TKey): Promise<TValue | undefined>;
  getEntriesByKeys(keys: TKey[]): Promise<RepositoryEntry<TValue, TKey>[]>;
  iterate(): AsyncIterable<TValue>;
  put(entries: RepositoryEntry<TValue, TKey>[]): Promise<void>;
  deleteByKeys(keys: TKey[]): Promise<void>;
  clear(): Promise<void>;
}

export interface IndexedItemRepository<TValue, TKey extends string = string>
  extends ItemRepository<TValue, TKey> {
  getByIndexValues(indexName: string, values: string[]): Promise<TValue[]>;
  getDistinctIndexValues(indexName: string): Promise<string[]>;
}

export interface Repositories {
  images: IndexedItemRepository<StoredImage>;
  frames: IndexedItemRepository<Frame>;
  frameGroups: ItemRepository<FrameGroup>;
  imageGroups: ItemRepository<StoredSerializableImageGroup>;
  palettes: ItemRepository<Palette>;
  plugins: ItemRepository<Plugin>;
  binaryImages: ItemRepository<string>;
  binaryFrames: ItemRepository<string>;
}

export interface WithRepositories {
  repositories: Repositories;
}

export type ItemsSourceInternal = ItemsSource & WithRepositories;
