import { type FastifyPluginAsync } from 'fastify';
import {
  type ItemsSourceTotalResponse,
  type Frame,
  type GetFramesByIdsParams,
  type UpdateFramesParams,
  type DeleteFramesByIdsParams,
  type ItemsMutationReponse,
} from 'gb-printer-schemas';
import { EndpointUrls } from '@/endpointUrls';

const framesRoutes: FastifyPluginAsync = async (app) => {
  app.post(EndpointUrls.POST_FRAMES, async (request): Promise<ItemsSourceTotalResponse<Frame>> => {
    return app.createItemsSource(request.user?.id).getFrames();
  });

  app.post(EndpointUrls.POST_FRAMES_BYIDS, async (request): Promise<ItemsSourceTotalResponse<Frame>> => {
    return app.createItemsSource(request.user?.id).getFramesByIds(request.body as GetFramesByIdsParams);
  });

  app.post(EndpointUrls.POST_FRAMES_UPDATE, async (request): Promise<ItemsMutationReponse> => {
    const response = app.createItemsSource(request.user?.id).updateFrames(request.body as UpdateFramesParams);
    void app.invalidation.broadcastInvalidations(request, response);
    return response;
  });

  app.post(EndpointUrls.POST_FRAMES_DELETE, async (request): Promise<ItemsMutationReponse> => {
    const response = app.createItemsSource(request.user?.id).deleteFramesByIds(request.body as DeleteFramesByIdsParams);
    void app.invalidation.broadcastInvalidations(request, response);
    return response;
  });
};

export default framesRoutes;
