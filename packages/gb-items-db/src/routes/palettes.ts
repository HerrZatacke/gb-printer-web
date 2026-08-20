import { type FastifyPluginAsync } from 'fastify';
import {
  type ItemsSourceTotalResponse,
  type Palette,
  type DeletePalettesByShortNamesParams,
  type GetPalettesByShortNamesParams,
  type UpdatePalettesParams,
  type ItemsSourceResponse,
} from 'gb-printer-schemas';

const palettesRoutes: FastifyPluginAsync = async (app) => {
  app.post('/palettes', async (): Promise<ItemsSourceTotalResponse<Palette>> => {
    return app.itemsSource.getPalettes();
  });

  app.post('/palettes/byShortNames', async (request): Promise<ItemsSourceResponse<Palette>> => {
    return app.itemsSource.getPalettesByShortNames(request.body as GetPalettesByShortNamesParams);
  });

  app.post('/palettes/update', async (request): Promise<void> => {
    return app.itemsSource.updatePalettes(request.body as UpdatePalettesParams);
  });

  app.post('/palettes/delete', async (request): Promise<void> => {
    return app.itemsSource.deletePalettesByShortNames(request.body as DeletePalettesByShortNamesParams);
  });
};

export default palettesRoutes;
