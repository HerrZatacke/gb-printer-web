import { type FastifyPluginAsync } from 'fastify';
import {
  type ItemsStatsResponse,
  type ItemsUsageReponse,
} from 'gb-printer-schemas';

const imagesRoutes: FastifyPluginAsync = async (app) => {
  app.get('/health', () => {
    return 'ok';
  });

  app.get('/stats', async (): Promise<ItemsStatsResponse> => {
    return app.itemsSource.getStats();
  });

  app.get('/maintenance', async (): Promise<void> => {
    return app.itemsSource.runMaintenance();
  });

  app.get('/usages', async (): Promise<ItemsUsageReponse> => {
    return app.itemsSource.getUsages();
  });
};

export default imagesRoutes;
