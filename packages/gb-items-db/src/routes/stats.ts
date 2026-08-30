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

  app.get(EndpointUrls.GET_STATS, async (request): Promise<ItemsStatsResponse> => {
    return app.createItemsSource(request.user?.id).getStats();
  });

  app.get(EndpointUrls.GET_MAINTENANCE, async (request): Promise<ItemsMutationReponse> => {
    const response = app.createItemsSource(request.user?.id).runMaintenance();
    void app.invalidation.broadcastInvalidations(request, response);
    return response;
  });

  app.get(EndpointUrls.GET_USAGES, async (request): Promise<ItemsUsageReponse> => {
    return app.createItemsSource(request.user?.id).getUsages();
  });
};

export default statsRoutes;
