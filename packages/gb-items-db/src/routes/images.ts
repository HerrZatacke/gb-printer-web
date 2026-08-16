import { type FastifyPluginAsync } from 'fastify';
import { type GetImagesParams, type Image, type ItemsSourceResponse } from 'gb-printer-schemas';

const imagesRoutes: FastifyPluginAsync = async (app) => {
  app.post('/images', async (request): Promise<ItemsSourceResponse<Image>> => {

    try {
      return app.itemsSource.getImages(request.body as GetImagesParams);
    } catch (error) {
      console.log(error);
    }


    return {
      items: [],
      paging: {
        filtered: 0,
        total: 0,
        page: 0,
        pageSize: 0,
        maxPageIndex: 0,
      },
      duration: 12345,
    };
  });
};

export default imagesRoutes;
