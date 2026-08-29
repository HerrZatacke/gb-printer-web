import { type FastifyPluginAsync } from 'fastify';
import {
  type ItemsSourceTotalResponse,
  type Palette,
  type DeletePalettesByShortNamesParams,
  type GetPalettesByShortNamesParams,
  type UpdatePalettesParams,
  type ItemsSourceResponse,
  type ItemsMutationReponse,
} from 'gb-printer-schemas';
import { EndpointUrls } from '@/endpointUrls';

const palettesRoutes: FastifyPluginAsync = async (app) => {
  app.post(EndpointUrls.POST_PALETTES, async (): Promise<ItemsSourceTotalResponse<Palette>> => {
    return app.createItemsSource('unknown').getPalettes();
  });

  app.post(EndpointUrls.POST_PALETTES_BYSHORTNAMES, async (request): Promise<ItemsSourceResponse<Palette>> => {
    return app.createItemsSource('unknown').getPalettesByShortNames(request.body as GetPalettesByShortNamesParams);
  });

  app.post(EndpointUrls.POST_PALETTES_UPDATE, async (request): Promise<ItemsMutationReponse> => {
    const response = app.createItemsSource('unknown').updatePalettes(request.body as UpdatePalettesParams);
    void app.invalidation.broadcastInvalidations(request, response);
    return response;
  });

  app.post(EndpointUrls.POST_PALETTES_DELETE, async (request): Promise<ItemsMutationReponse> => {
    const response = app.createItemsSource('unknown').deletePalettesByShortNames(request.body as DeletePalettesByShortNamesParams);
    void app.invalidation.broadcastInvalidations(request, response);
    return response;
  });
};

export default palettesRoutes;
