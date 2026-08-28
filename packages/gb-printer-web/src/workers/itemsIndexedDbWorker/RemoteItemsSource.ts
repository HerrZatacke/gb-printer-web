import { EndpointUrls } from 'gb-items-db/src/endpointUrls';
import { type ItemsSource } from 'gb-items-source';
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
  type ItemsMutationReponse,
  type ItemsReferenceList,
  type ItemsSourceResponse,
  type ItemsSourceTotalResponse,
  type ItemsStatsResponse,
  type ItemsUsageReponse,
  type Palette,
  type Plugin,
  type RootItemSourceResponse,
  type SerializableImageGroup,
  type TreeImageGroup,
  type UpdateBinaryItemsParams,
  type UpdateFrameGroupsParams,
  type UpdateFramesParams,
  type UpdateImageGroupsParams,
  type UpdateImagesParams,
  type UpdatePalettesParams,
  type UpdatePluginsParams,
} from 'gb-printer-schemas';
import { $fetch } from 'ofetch';
import { cleanDoubleSlashes } from 'ufo';
import { v4 } from 'uuid';
import { isMutationResult } from '@/workers/itemsIndexedDbWorker/tools/isMutationResult';
import { RunInvalidationsFn } from '@/workers/itemsIndexedDbWorker/types';

export class RemoteItemsSource implements ItemsSource {
  private clientId: string;
  private reconnectAttempt = 0;
  private reconnectTimer: number | undefined;
  private intentionalClose = false;
  private socket: WebSocket | undefined;

  constructor(private readonly baseUrl: string) {
    this.clientId = v4();
  }

  private readonly get = async <T>(url: string): Promise<T> => {
    return $fetch(cleanDoubleSlashes(`${this.baseUrl}${url}`), {
      method: 'GET',
      headers: {
        'x-client-id': this.clientId,
      },
    });
  };

  private readonly post = async <T>(url: string, body?: Record<string, unknown>): Promise<T> => {
    return $fetch(cleanDoubleSlashes(`${this.baseUrl}${url}`), {
      method: 'POST',
      headers: {
        'x-client-id': this.clientId,
      },
      body,
    });
  };

  subscribeToInvalidations = (runInvalidations: RunInvalidationsFn): void => {
    this.intentionalClose = false;
    this.connect(runInvalidations);

    self.addEventListener('offline', () => {
      this.socket?.close();
    });

    self.addEventListener('online', () => {
      if (!this.intentionalClose) {
        this.reconnectAttempt = 0;
        this.connect(runInvalidations);
      }
    });
  };

  private connect = (runInvalidations: RunInvalidationsFn): void => {
    const socket = new WebSocket(cleanDoubleSlashes(`${this.baseUrl}${EndpointUrls.WS_INVALIDATIONS}?clientId=${this.clientId}`));

    this.socket = socket;

    socket.addEventListener('open', () => {
      this.reconnectAttempt = 0;
    });

    socket.addEventListener('message', (event) => {
      const payload = JSON.parse(event.data) as ItemsMutationReponse;

      if (isMutationResult(payload)) {
        void runInvalidations(payload.invalidations);
      }
    });

    socket.addEventListener('close', () => {
      if (this.intentionalClose) {
        return;
      }

      const delay = Math.min(1000 * (2 ** this.reconnectAttempt), 30000);
      this.reconnectAttempt += 1;

      this.reconnectTimer = self.setTimeout(() => {
        this.connect(runInvalidations);
      }, delay);
    });
  };

  disconnect = (): void => {
    this.intentionalClose = true;
    clearTimeout(this.reconnectTimer);
    this.socket?.close();
  };

  // stats

  runMaintenance = async (): Promise<ItemsMutationReponse> => {
    return this.get<ItemsMutationReponse>(EndpointUrls.GET_MAINTENANCE);
  };

  getStats = async (): Promise<ItemsStatsResponse> => {
    return this.get<ItemsStatsResponse>(EndpointUrls.GET_STATS);
  };

  getUsages = async (): Promise<ItemsUsageReponse> => {
    return this.get<ItemsUsageReponse>(EndpointUrls.GET_USAGES);
  };

  // images

  getImages = async (params: GetImagesParams): Promise<ItemsSourceResponse<Image>> => {
    return this.post<ItemsSourceResponse<Image>>(EndpointUrls.POST_IMAGES, params);
  };

  getAllTags = async (): Promise<ItemsSourceTotalResponse<string>> => {
    return this.post<ItemsSourceTotalResponse<string>>(EndpointUrls.POST_IMAGES_TAGS);
  };

  getImagesByHashes = async (params: GetImagesByHashesParams): Promise<ItemsSourceResponse<Image>> => {
    return this.post<ItemsSourceResponse<Image>>(EndpointUrls.POST_IMAGES_BYHASHES, params);
  };

  getImagesByAnyHashes = async (params: GetImagesByAnyHashesParams): Promise<ItemsSourceResponse<ItemsReferenceList<Image>>> => {
    return this.post<ItemsSourceResponse<ItemsReferenceList<Image>>>(EndpointUrls.POST_IMAGES_BYANYHASHES, params);
  };

  getHashesByGroupId = async (params: GetHashesByGroupIdParams): Promise<ItemsSourceTotalResponse<string>> => {
    return this.post<ItemsSourceTotalResponse<string>>(EndpointUrls.POST_IMAGES_HASHESBYGROUPID, params);
  };

  getGroupItemsByGroupId = async (params: GetGroupItemsByGroupIdParams): Promise<ItemsSourceResponse<GroupItem>> => {
    return this.post<ItemsSourceResponse<GroupItem>>(EndpointUrls.POST_IMAGES_GROUPITEMSBYGROUPID, params);
  };

  updateImages = async (params: UpdateImagesParams): Promise<ItemsMutationReponse> => {
    return this.post<ItemsMutationReponse>(EndpointUrls.POST_IMAGES_UPDATE, params);
  };

  deleteImagesByHashes = async (params: DeleteImagesByHashesParams): Promise<ItemsMutationReponse> => {
    return this.post<ItemsMutationReponse>(EndpointUrls.POST_IMAGES_DELETE, params);
  };

  // image groups

  getImageGroupsFullTree = async (): Promise<RootItemSourceResponse<TreeImageGroup>> => {
    return this.post<RootItemSourceResponse<TreeImageGroup>>(EndpointUrls.POST_IMAGEGROUPS_TREE);
  };

  getImageGroupsList = async (): Promise<ItemsSourceTotalResponse<SerializableImageGroup>> => {
    return this.post<ItemsSourceTotalResponse<SerializableImageGroup>>(EndpointUrls.POST_IMAGEGROUPS_LIST);
  };

  updateImageGroups = async (params: UpdateImageGroupsParams): Promise<ItemsMutationReponse> => {
    return this.post<ItemsMutationReponse>(EndpointUrls.POST_IMAGEGROUPS_UPDATE, params);
  };

  deleteImageGroupsByIds = async (params: DeleteImageGroupsByIdsParams): Promise<ItemsMutationReponse> => {
    return this.post<ItemsMutationReponse>(EndpointUrls.POST_IMAGEGROUPS_DELETE, params);
  };

  // frames

  getFrames = async (): Promise<ItemsSourceTotalResponse<Frame>> => {
    return this.post<ItemsSourceTotalResponse<Frame>>(EndpointUrls.POST_FRAMES);
  };

  getFramesByHashes = async (params: GetFramesByHashesParams): Promise<ItemsSourceTotalResponse<Frame>> => {
    return this.post<ItemsSourceTotalResponse<Frame>>(EndpointUrls.POST_FRAMES_BYHASHES, params);
  };

  getFramesByIds = async (params: GetFramesByIdsParams): Promise<ItemsSourceTotalResponse<Frame>> => {
    return this.post<ItemsSourceTotalResponse<Frame>>(EndpointUrls.POST_FRAMES_BYIDS, params);
  };

  updateFrames = async (params: UpdateFramesParams): Promise<ItemsMutationReponse> => {
    return this.post<ItemsMutationReponse>(EndpointUrls.POST_FRAMES_UPDATE, params);
  };

  deleteFramesByIds = async (params: DeleteFramesByIdsParams): Promise<ItemsMutationReponse> => {
    return this.post<ItemsMutationReponse>(EndpointUrls.POST_FRAMES_DELETE, params);
  };

  // frame groups

  getFrameGroups = async (): Promise<ItemsSourceTotalResponse<FrameGroup>> => {
    return this.post<ItemsSourceTotalResponse<FrameGroup>>(EndpointUrls.POST_FRAMEGROUPS);
  };

  updateFrameGroups = async (params: UpdateFrameGroupsParams): Promise<ItemsMutationReponse> => {
    return this.post<ItemsMutationReponse>(EndpointUrls.POST_FRAMEGROUPS_UPDATE, params);
  };

  deleteFrameGroupsByIds = async (params: DeleteFrameGroupsByIdsParams): Promise<ItemsMutationReponse> => {
    return this.post<ItemsMutationReponse>(EndpointUrls.POST_FRAMEGROUPS_DELETE, params);
  };

  // palettes

  getPalettes = async (): Promise<ItemsSourceTotalResponse<Palette>> => {
    return this.post<ItemsSourceTotalResponse<Palette>>(EndpointUrls.POST_PALETTES);
  };

  getPalettesByShortNames = async (params: GetPalettesByShortNamesParams): Promise<ItemsSourceResponse<Palette>> => {
    return this.post<ItemsSourceResponse<Palette>>(EndpointUrls.POST_PALETTES_BYSHORTNAMES, params);
  };

  updatePalettes = async (params: UpdatePalettesParams): Promise<ItemsMutationReponse> => {
    return this.post<ItemsMutationReponse>(EndpointUrls.POST_PALETTES_UPDATE, params);
  };

  deletePalettesByShortNames = async (params: DeletePalettesByShortNamesParams): Promise<ItemsMutationReponse> => {
    return this.post<ItemsMutationReponse>(EndpointUrls.POST_PALETTES_DELETE, params);
  };

  // plugins

  getPlugins = async (): Promise<ItemsSourceTotalResponse<Plugin>> => {
    return this.post<ItemsSourceTotalResponse<Plugin>>(EndpointUrls.POST_PLUGINS);
  };

  getPluginsByUrls = async (params: GetPluginsByUrlsParams): Promise<ItemsSourceResponse<Plugin>> => {
    return this.post<ItemsSourceResponse<Plugin>>(EndpointUrls.POST_PLUGINS_BYURLS, params);
  };

  updatePlugins = async (params: UpdatePluginsParams): Promise<ItemsMutationReponse> => {
    return this.post<ItemsMutationReponse>(EndpointUrls.POST_PLUGINS_UPDATE, params);
  };

  deletePluginsByUrls = async (params: DeletePluginsByUrlsParams): Promise<ItemsMutationReponse> => {
    return this.post<ItemsMutationReponse>(EndpointUrls.POST_PLUGINS_DELETE, params);
  };

  // binary images

  getBinaryImagesByHashes = async (params: GetBinaryItemsByHashesParams): Promise<ItemsSourceResponse<BinaryStoreItem>> => {
    return this.post<ItemsSourceResponse<BinaryStoreItem>>(EndpointUrls.POST_BINARYIMAGES_BYHASHES, params);
  };

  getBinaryImageHashes = async (): Promise<ItemsSourceTotalResponse<string>> => {
    return this.post<ItemsSourceTotalResponse<string>>(EndpointUrls.POST_BINARYIMAGES_HASHES);
  };

  updateBinaryImages = async (params: UpdateBinaryItemsParams): Promise<ItemsMutationReponse> => {
    return this.post<ItemsMutationReponse>(EndpointUrls.POST_BINARYIMAGES_UPDATE, params);
  };

  deleteBinaryImagesByHashes = async (params: DeleteBinaryItemsByHashesParams): Promise<ItemsMutationReponse> => {
    return this.post<ItemsMutationReponse>(EndpointUrls.POST_BINARYIMAGES_DELETE, params);
  };

  // binary frames

  getBinaryFramesByHashes = async (params: GetBinaryItemsByHashesParams): Promise<ItemsSourceResponse<BinaryStoreItem>> => {
    return this.post<ItemsSourceResponse<BinaryStoreItem>>(EndpointUrls.POST_BINARYFRAMES_BYHASHES, params);
  };

  getBinaryFrameHashes = async (): Promise<ItemsSourceTotalResponse<string>> => {
    return this.post<ItemsSourceTotalResponse<string>>(EndpointUrls.POST_BINARYFRAMES_HASHES);
  };

  updateBinaryFrames = async (params: UpdateBinaryItemsParams): Promise<ItemsMutationReponse> => {
    return this.post<ItemsMutationReponse>(EndpointUrls.POST_BINARYFRAMES_UPDATE, params);
  };

  deleteBinaryFramesByHashes = async (params: DeleteBinaryItemsByHashesParams): Promise<ItemsMutationReponse> => {
    return this.post<ItemsMutationReponse>(EndpointUrls.POST_BINARYFRAMES_DELETE, params);
  };
}
