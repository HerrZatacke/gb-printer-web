import { type FastifyPluginAsync } from 'fastify';
import {
  type ItemsMutationReponse,
  type ItemsStatsResponse,
  type ItemsUsageReponse,
} from 'gb-printer-schemas';
import { EndpointUrls } from '@/endpointUrls';

const imagesRoutes: FastifyPluginAsync = async (app) => {
  app.get(EndpointUrls.GET_HEALTH, () => {
    return 'ok';
  });

  app.get(EndpointUrls.GET_STATS, async (): Promise<ItemsStatsResponse> => {
    return app.itemsSource.getStats();
  });

  app.get(EndpointUrls.GET_MAINTENANCE, async (): Promise<ItemsMutationReponse> => {
    return app.itemsSource.runMaintenance();
  });

  app.get(EndpointUrls.GET_USAGES, async (): Promise<ItemsUsageReponse> => {
    return app.itemsSource.getUsages();
  });
};

export default imagesRoutes;
