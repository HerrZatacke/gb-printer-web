import { type FastifyPluginAsync } from 'fastify';
import {
  type DeleteImagesByHashesParams,
  type GetGroupItemsByGroupIdParams,
  type GetHashesByGroupIdParams,
  type GetImagesByAnyHashesParams,
  type GetImagesByHashesParams,
  type GetImagesParams,
  type GroupItem,
  type Image,
  type ItemsReferenceList,
  type ItemsSourceResponse,
  type ItemsSourceTotalResponse,
  type UpdateImagesParams,
} from 'gb-printer-schemas';

const imagesRoutes: FastifyPluginAsync = async (app) => {
  app.post('/images', async (request): Promise<ItemsSourceResponse<Image>> => {
    return app.itemsSource.getImages(request.body as GetImagesParams);
  });

  app.post('/images/tags', async (): Promise<ItemsSourceTotalResponse<string>> => {
    return app.itemsSource.getAllTags();
  });

  app.post('/images/byHashes', async (request): Promise<ItemsSourceResponse<Image>> => {
    return app.itemsSource.getImagesByHashes(request.body as GetImagesByHashesParams);
  });

  app.post('/images/byAnyHashes', async (request): Promise<ItemsSourceResponse<ItemsReferenceList<Image>>> => {
    return app.itemsSource.getImagesByAnyHashes(request.body as GetImagesByAnyHashesParams);
  });

  app.post('/images/hashesByGroupId', async (request): Promise<ItemsSourceTotalResponse<string>> => {
    return app.itemsSource.getHashesByGroupId(request.body as GetHashesByGroupIdParams);
  });

  app.post('/images/groupItemsByGroupId', async (request): Promise<ItemsSourceResponse<GroupItem>> => {
    return app.itemsSource.getGroupItemsByGroupId(request.body as GetGroupItemsByGroupIdParams);
  });

  app.post('/images/update', async (request): Promise<void> => {
    return app.itemsSource.updateImages(request.body as UpdateImagesParams);
  });

  app.post('/images/delete', async (request): Promise<void> => {
    return app.itemsSource.deleteImagesByHashes(request.body as DeleteImagesByHashesParams);
  });
};

export default imagesRoutes;
