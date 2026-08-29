import { type FastifyPluginAsync } from 'fastify';
import {
  type ItemsMutationReponse,
  type ItemsStatsResponse,
  type ItemsUsageReponse,
} from 'gb-printer-schemas';
import { EndpointUrls } from '@/endpointUrls';

const statsRoutes: FastifyPluginAsync = async (app) => {
  app.get(EndpointUrls.GET_HEALTH, () => {
    return 'ok';
  });

  app.get(EndpointUrls.GET_STATS, async (): Promise<ItemsStatsResponse> => {
    return app.itemsSource.getStats();
  });

  app.get(EndpointUrls.GET_MAINTENANCE, async (request): Promise<ItemsMutationReponse> => {
    const response = app.itemsSource.runMaintenance();
    void app.invalidation.broadcastInvalidations(request, response);
    return response;
  });

  app.get(EndpointUrls.GET_USAGES, async (): Promise<ItemsUsageReponse> => {
    return app.itemsSource.getUsages();
  });
};

export default statsRoutes;
