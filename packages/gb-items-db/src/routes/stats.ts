import { type FastifyPluginAsync } from 'fastify';
import { type ItemsStatsResponse } from 'gb-printer-schemas';

const imagesRoutes: FastifyPluginAsync = async (app) => {
  app.get('/health', () => {
    return 'ok';
  });

  app.get('/stats', async (): Promise<ItemsStatsResponse> => {
    return {
      totals: {
        palettes: 0,
        plugins: 0,
        frames: 0,
        frameGroups: 0,
        images: 0,
        imageGroups: 0,
        binaryImages: 0,
        binaryFrames: 0,
      },
      duration: 123,
    };
  });
};

export default imagesRoutes;
