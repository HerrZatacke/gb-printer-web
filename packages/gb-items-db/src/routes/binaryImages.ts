import { type FastifyPluginAsync } from 'fastify';
import {
  type ItemsSourceTotalResponse,
  type ItemsSourceResponse,
  type GetBinaryItemsByHashesParams,
  type UpdateBinaryItemsParams,
  type DeleteBinaryItemsByHashesParams,
  type BinaryStoreItem,
  type ItemsMutationReponse,
} from 'gb-printer-schemas';
import { EndpointUrls } from '@/endpointUrls';

const binaryImagesRoutes: FastifyPluginAsync = async (app) => {
  app.post(EndpointUrls.POST_BINARYIMAGES_BYHASHES, async (request): Promise<ItemsSourceResponse<BinaryStoreItem>> => {
    return app.createItemsSource(request.user?.id).getBinaryImagesByHashes(request.body as GetBinaryItemsByHashesParams);
  });

  app.post(EndpointUrls.POST_BINARYIMAGES_HASHES, async (request): Promise<ItemsSourceTotalResponse<string>> => {
    return app.createItemsSource(request.user?.id).getBinaryImageHashes();
  });

  app.post(EndpointUrls.POST_BINARYIMAGES_ORPHANED, async (request): Promise<ItemsSourceTotalResponse<string>> => {
    return app.createItemsSource(request.user?.id).getOrphanedImageHashes();
  });

  app.post(EndpointUrls.POST_BINARYIMAGES_UPDATE, async (request): Promise<ItemsMutationReponse> => {
    const response = app.createItemsSource(request.user?.id).updateBinaryImages(request.body as UpdateBinaryItemsParams);
    void app.invalidation.broadcastInvalidations(request, response);
    return response;
  });

  app.post(EndpointUrls.POST_BINARYIMAGES_DELETE, async (request): Promise<ItemsMutationReponse> => {
    const response = app.createItemsSource(request.user?.id).deleteBinaryImagesByHashes(request.body as DeleteBinaryItemsByHashesParams);
    void app.invalidation.broadcastInvalidations(request, response);
    return response;
  });
};

export default binaryImagesRoutes;
