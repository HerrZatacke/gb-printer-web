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
    return app.itemsSource.getPlugins();
  });

  app.post(EndpointUrls.POST_PLUGINS_BYURLS, async (request): Promise<ItemsSourceResponse<Plugin>> => {
    return app.itemsSource.getPluginsByUrls(request.body as GetPluginsByUrlsParams);
  });

  app.post(EndpointUrls.POST_PLUGINS_UPDATE, async (request): Promise<ItemsMutationReponse> => {
    return app.itemsSource.updatePlugins(request.body as UpdatePluginsParams);
  });

  app.post(EndpointUrls.POST_PLUGINS_DELETE, async (request): Promise<ItemsMutationReponse> => {
    return app.itemsSource.deletePluginsByUrls(request.body as DeletePluginsByUrlsParams);
  });
};

export default pluginsRoutes;
