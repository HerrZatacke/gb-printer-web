import { type FastifyPluginAsync } from 'fastify';
import {
  type ItemsSourceTotalResponse,
  type Frame,
  type GetFramesByHashesParams,
  type GetFramesByIdsParams,
  type UpdateFramesParams,
  type DeleteFramesByIdsParams,
} from 'gb-printer-schemas';

const framesRoutes: FastifyPluginAsync = async (app) => {
  app.post('/frames', async (): Promise<ItemsSourceTotalResponse<Frame>> => {
    return app.itemsSource.getFrames();
  });

  app.post('/frames/byHashes', async (request): Promise<ItemsSourceTotalResponse<Frame>> => {
    return app.itemsSource.getFramesByHashes(request.body as GetFramesByHashesParams);
  });

  app.post('/frames/byIds', async (request): Promise<ItemsSourceTotalResponse<Frame>> => {
    return app.itemsSource.getFramesByIds(request.body as GetFramesByIdsParams);
  });

  app.post('/frames/update', async (request): Promise<void> => {
    return app.itemsSource.updateFrames(request.body as UpdateFramesParams);
  });

  app.post('/frames/delete', async (request): Promise<void> => {
    return app.itemsSource.deleteFramesByIds(request.body as DeleteFramesByIdsParams);
  });
};

export default framesRoutes;
