import { type FastifyPluginAsync } from 'fastify';
import {
  type ItemsSourceTotalResponse,
  type Frame,
  type GetFramesByHashesParams,
  type GetFramesByIdsParams,
  type UpdateFramesParams,
  type DeleteFramesByIdsParams,
} from 'gb-printer-schemas';
import { EndpointUrls } from '@/endpointUrls';

const framesRoutes: FastifyPluginAsync = async (app) => {
  app.post(EndpointUrls.POST_FRAMES, async (): Promise<ItemsSourceTotalResponse<Frame>> => {
    return app.itemsSource.getFrames();
  });

  app.post(EndpointUrls.POST_FRAMES_BYHASHES, async (request): Promise<ItemsSourceTotalResponse<Frame>> => {
    return app.itemsSource.getFramesByHashes(request.body as GetFramesByHashesParams);
  });

  app.post(EndpointUrls.POST_FRAMES_BYIDS, async (request): Promise<ItemsSourceTotalResponse<Frame>> => {
    return app.itemsSource.getFramesByIds(request.body as GetFramesByIdsParams);
  });

  app.post(EndpointUrls.POST_FRAMES_UPDATE, async (request): Promise<void> => {
    return app.itemsSource.updateFrames(request.body as UpdateFramesParams);
  });

  app.post(EndpointUrls.POST_FRAMES_DELETE, async (request): Promise<void> => {
    return app.itemsSource.deleteFramesByIds(request.body as DeleteFramesByIdsParams);
  });
};

export default framesRoutes;
