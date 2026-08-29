import { type FastifyPluginAsync } from 'fastify';
import {
  type ItemsSourceTotalResponse,
  type Plugin,
  type UpdatePluginsParams,
  type ItemsSourceResponse,
  type GetPluginsByUrlsParams,
  type DeletePluginsByUrlsParams,
  type ItemsMutationReponse,
} from 'gb-printer-schemas';
import { EndpointUrls } from '@/endpointUrls';

const pluginsRoutes: FastifyPluginAsync = async (app) => {
  app.post(EndpointUrls.POST_PLUGINS, async (): Promise<ItemsSourceTotalResponse<Plugin>> => {
    return app.createItemsSource('unknown').getPlugins();
  });

  app.post(EndpointUrls.POST_PLUGINS_BYURLS, async (request): Promise<ItemsSourceResponse<Plugin>> => {
    return app.createItemsSource('unknown').getPluginsByUrls(request.body as GetPluginsByUrlsParams);
  });

  app.post(EndpointUrls.POST_PLUGINS_UPDATE, async (request): Promise<ItemsMutationReponse> => {
    const response = app.createItemsSource('unknown').updatePlugins(request.body as UpdatePluginsParams);
    void app.invalidation.broadcastInvalidations(request, response);
    return response;
  });

  app.post(EndpointUrls.POST_PLUGINS_DELETE, async (request): Promise<ItemsMutationReponse> => {
    const response = app.createItemsSource('unknown').deletePluginsByUrls(request.body as DeletePluginsByUrlsParams);
    void app.invalidation.broadcastInvalidations(request, response);
    return response;
  });
};

export default pluginsRoutes;
