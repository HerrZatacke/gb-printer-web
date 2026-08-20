import { type FastifyPluginAsync } from 'fastify';
import {
  type ItemsSourceTotalResponse,
  type Plugin,
  type UpdatePluginsParams,
  type ItemsSourceResponse,
  type GetPluginsByUrlsParams,
  type DeletePluginsByUrlsParams,
} from 'gb-printer-schemas';

const pluginsRoutes: FastifyPluginAsync = async (app) => {
  app.post('/plugins', async (): Promise<ItemsSourceTotalResponse<Plugin>> => {
    return app.itemsSource.getPlugins();
  });

  app.post('/plugins/byUrls', async (request): Promise<ItemsSourceResponse<Plugin>> => {
    return app.itemsSource.getPluginsByUrls(request.body as GetPluginsByUrlsParams);
  });

  app.post('/plugins/update', async (request): Promise<void> => {
    return app.itemsSource.updatePlugins(request.body as UpdatePluginsParams);
  });

  app.post('/plugins/delete', async (request): Promise<void> => {
    return app.itemsSource.deletePluginsByUrls(request.body as DeletePluginsByUrlsParams);
  });
};

export default pluginsRoutes;
