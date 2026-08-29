import { type FastifyPluginAsync } from 'fastify';
import {
  type ItemsSourceTotalResponse,
  type Frame,
  type GetFramesByHashesParams,
  type GetFramesByIdsParams,
  type UpdateFramesParams,
  type DeleteFramesByIdsParams,
  type ItemsMutationReponse,
} from 'gb-printer-schemas';
import { EndpointUrls } from '@/endpointUrls';

const framesRoutes: FastifyPluginAsync = async (app) => {
  app.post(EndpointUrls.POST_FRAMES, async (): Promise<ItemsSourceTotalResponse<Frame>> => {
    return app.createItemsSource('unknown').getFrames();
  });

  app.post(EndpointUrls.POST_FRAMES_BYHASHES, async (request): Promise<ItemsSourceTotalResponse<Frame>> => {
    return app.createItemsSource('unknown').getFramesByHashes(request.body as GetFramesByHashesParams);
  });

  app.post(EndpointUrls.POST_FRAMES_BYIDS, async (request): Promise<ItemsSourceTotalResponse<Frame>> => {
    return app.createItemsSource('unknown').getFramesByIds(request.body as GetFramesByIdsParams);
  });

  app.post(EndpointUrls.POST_FRAMES_UPDATE, async (request): Promise<ItemsMutationReponse> => {
    const response = app.createItemsSource('unknown').updateFrames(request.body as UpdateFramesParams);
    void app.invalidation.broadcastInvalidations(request, response);
    return response;
  });

  app.post(EndpointUrls.POST_FRAMES_DELETE, async (request): Promise<ItemsMutationReponse> => {
    const response = app.createItemsSource('unknown').deleteFramesByIds(request.body as DeleteFramesByIdsParams);
    void app.invalidation.broadcastInvalidations(request, response);
    return response;
  });
};

export default framesRoutes;
