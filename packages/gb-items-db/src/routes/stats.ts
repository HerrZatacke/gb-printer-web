import { type FastifyPluginAsync } from 'fastify';
import { type ItemsStatsResponse } from 'gb-printer-schemas';

const imagesRoutes: FastifyPluginAsync = async (app) => {
  app.get('/health', () => {
    return 'ok';
  });

  app.get('/stats', async (): Promise<ItemsStatsResponse> => {
    return app.itemsSource.getStats();
  });
};

export default imagesRoutes;
