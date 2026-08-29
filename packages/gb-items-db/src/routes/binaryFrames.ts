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

const binaryFramesRoutes: FastifyPluginAsync = async (app) => {
  app.post(EndpointUrls.POST_BINARYFRAMES_BYHASHES, async (request): Promise<ItemsSourceResponse<BinaryStoreItem>> => {
    return app.createItemsSource('unknown').getBinaryFramesByHashes(request.body as GetBinaryItemsByHashesParams);
  });

  app.post(EndpointUrls.POST_BINARYFRAMES_HASHES, async (): Promise<ItemsSourceTotalResponse<string>> => {
    return app.createItemsSource('unknown').getBinaryFrameHashes();
  });

  app.post(EndpointUrls.POST_BINARYFRAMES_UPDATE, async (request): Promise<ItemsMutationReponse> => {
    const response = app.createItemsSource('unknown').updateBinaryFrames(request.body as UpdateBinaryItemsParams);
    void app.invalidation.broadcastInvalidations(request, response);
    return response;
  });

  app.post(EndpointUrls.POST_BINARYFRAMES_DELETE, async (request): Promise<ItemsMutationReponse> => {
    const response = app.createItemsSource('unknown').deleteBinaryFramesByHashes(request.body as DeleteBinaryItemsByHashesParams);
    void app.invalidation.broadcastInvalidations(request, response);
    return response;
  });
};

export default binaryFramesRoutes;
