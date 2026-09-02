import {
  ItemStoreNames,
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
  type GetFramesByIdsParams,
  type GetGroupItemsByGroupIdParams,
  type GetHashesByGroupIdParams,
  type GetImagesByHashesParams,
  type GetImagesParams,
  type GetPalettesByShortNamesParams,
  type GetPluginsByUrlsParams,
  type GroupItem,
  type Image,
  type ItemsMutationReponse,
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
  runMaintenance(): Promise<ItemsMutationReponse>;
  getStats(): Promise<ItemsStatsResponse>;
  getUsages(): Promise<ItemsUsageReponse>;

  getAllTags(): Promise<ItemsSourceTotalResponse<string>>;
  getGroupItemsByGroupId(params: GetGroupItemsByGroupIdParams): Promise<ItemsSourceResponse<GroupItem>>;
  getHashesByGroupId(params: GetHashesByGroupIdParams): Promise<ItemsSourceTotalResponse<string>>;
  getImages(params: GetImagesParams): Promise<ItemsSourceResponse<Image>>;
  getImagesByHashes(params: GetImagesByHashesParams): Promise<ItemsSourceResponse<Image>>;
  updateImages(params: UpdateImagesParams): Promise<ItemsMutationReponse>;
  deleteImagesByHashes(params: DeleteImagesByHashesParams): Promise<ItemsMutationReponse>;

  getImageGroupsFullTree(): Promise<RootItemSourceResponse<TreeImageGroup>>;
  getImageGroupsList(): Promise<ItemsSourceTotalResponse<SerializableImageGroup>>;
  updateImageGroups(params: UpdateImageGroupsParams): Promise<ItemsMutationReponse>;
  deleteImageGroupsByIds(params: DeleteImageGroupsByIdsParams): Promise<ItemsMutationReponse>;

  getFrames(): Promise<ItemsSourceTotalResponse<Frame>>;
  getFramesByIds(params: GetFramesByIdsParams): Promise<ItemsSourceTotalResponse<Frame>>;
  updateFrames(params: UpdateFramesParams): Promise<ItemsMutationReponse>;
  deleteFramesByIds(params: DeleteFramesByIdsParams): Promise<ItemsMutationReponse>;

  getFrameGroups(): Promise<ItemsSourceTotalResponse<FrameGroup>>;
  updateFrameGroups(params: UpdateFrameGroupsParams): Promise<ItemsMutationReponse>;
  deleteFrameGroupsByIds(params: DeleteFrameGroupsByIdsParams): Promise<ItemsMutationReponse>;

  getPalettes() : Promise<ItemsSourceTotalResponse<Palette>>;
  getPalettesByShortNames(params: GetPalettesByShortNamesParams) : Promise<ItemsSourceResponse<Palette>>;
  updatePalettes(params: UpdatePalettesParams): Promise<ItemsMutationReponse>;
  deletePalettesByShortNames(params: DeletePalettesByShortNamesParams): Promise<ItemsMutationReponse>;

  getPlugins(): Promise<ItemsSourceTotalResponse<Plugin>>;
  getPluginsByUrls(params: GetPluginsByUrlsParams): Promise<ItemsSourceResponse<Plugin>>;
  updatePlugins(params: UpdatePluginsParams): Promise<ItemsMutationReponse>;
  deletePluginsByUrls(params: DeletePluginsByUrlsParams): Promise<ItemsMutationReponse>;

  getBinaryImagesByHashes(params: GetBinaryItemsByHashesParams): Promise<ItemsSourceResponse<BinaryStoreItem>>;
  getBinaryImageHashes(): Promise<ItemsSourceTotalResponse<string>>;
  updateBinaryImages(params: UpdateBinaryItemsParams): Promise<ItemsMutationReponse>;
  deleteBinaryImagesByHashes(params: DeleteBinaryItemsByHashesParams): Promise<ItemsMutationReponse>;
  getOrphanedFrameHashes(): Promise<ItemsSourceTotalResponse<string>>;

  getBinaryFramesByHashes(params: GetBinaryItemsByHashesParams): Promise<ItemsSourceResponse<BinaryStoreItem>>;
  getBinaryFrameHashes(): Promise<ItemsSourceTotalResponse<string>>;
  updateBinaryFrames(params: UpdateBinaryItemsParams): Promise<ItemsMutationReponse>;
  deleteBinaryFramesByHashes(params: DeleteBinaryItemsByHashesParams): Promise<ItemsMutationReponse>;
  getOrphanedImageHashes(): Promise<ItemsSourceTotalResponse<string>>;
}

export interface FilterableFacet {
  tags: string[];
  specialTags: SpecialTags[];
  palettes: string[];
  frames: string[];
}

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

export type Repositories = {
  [ItemStoreNames.IMAGES]: IndexedItemRepository<StoredImage>;
  [ItemStoreNames.FRAMES]: IndexedItemRepository<Frame>;
  [ItemStoreNames.FRAMEGROUPS]: ItemRepository<FrameGroup>;
  [ItemStoreNames.IMAGEGROUPS]: ItemRepository<StoredSerializableImageGroup>;
  [ItemStoreNames.PALETTES]: ItemRepository<Palette>;
  [ItemStoreNames.PLUGINS]: ItemRepository<Plugin>;
  [ItemStoreNames.BINARYIMAGES]: ItemRepository<string>;
  [ItemStoreNames.BINARYFRAMES]: ItemRepository<string>;
}

export interface WithRepositories {
  repositories: Repositories;
}

export type ItemsSourceInternal = ItemsSource & WithRepositories;
