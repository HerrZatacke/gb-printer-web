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
    return app.createItemsSource('unknown').getBinaryImagesByHashes(request.body as GetBinaryItemsByHashesParams);
  });

  app.post(EndpointUrls.POST_BINARYIMAGES_HASHES, async (): Promise<ItemsSourceTotalResponse<string>> => {
    return app.createItemsSource('unknown').getBinaryImageHashes();
  });

  app.post(EndpointUrls.POST_BINARYIMAGES_UPDATE, async (request): Promise<ItemsMutationReponse> => {
    const response = app.createItemsSource('unknown').updateBinaryImages(request.body as UpdateBinaryItemsParams);
    void app.invalidation.broadcastInvalidations(request, response);
    return response;
  });

  app.post(EndpointUrls.POST_BINARYIMAGES_DELETE, async (request): Promise<ItemsMutationReponse> => {
    const response = app.createItemsSource('unknown').deleteBinaryImagesByHashes(request.body as DeleteBinaryItemsByHashesParams);
    void app.invalidation.broadcastInvalidations(request, response);
    return response;
  });
};

export default binaryImagesRoutes;
