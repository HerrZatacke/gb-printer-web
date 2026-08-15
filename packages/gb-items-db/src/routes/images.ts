import { type FastifyPluginAsync } from 'fastify';
import { type GetImagesParams, type Image, type ItemsSourceResponse } from 'gb-printer-schemas';

const imagesRoutes: FastifyPluginAsync = async (app) => {
  app.post('/images', async (request): Promise<ItemsSourceResponse<Image>> => {
    const { params, candidateHashes } = request.body as GetImagesParams;

    console.log({
      params,
      candidateHashes,
    });

    return {
      items: [],
      paging: {
        filtered: 0,
        total: 0,
        page: 0,
        pageSize: 0,
        maxPageIndex: 0,
      },
      duration: 123,
    };
  });
};

export default imagesRoutes;
