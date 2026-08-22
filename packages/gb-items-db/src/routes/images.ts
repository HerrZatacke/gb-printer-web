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
import { EndpointUrls } from '@/endpointUrls';

const imagesRoutes: FastifyPluginAsync = async (app) => {
  app.post(EndpointUrls.POST_IMAGES, async (request): Promise<ItemsSourceResponse<Image>> => {
    return app.itemsSource.getImages(request.body as GetImagesParams);
  });

  app.post(EndpointUrls.POST_IMAGES_TAGS, async (): Promise<ItemsSourceTotalResponse<string>> => {
    return app.itemsSource.getAllTags();
  });

  app.post(EndpointUrls.POST_IMAGES_BYHASHES, async (request): Promise<ItemsSourceResponse<Image>> => {
    return app.itemsSource.getImagesByHashes(request.body as GetImagesByHashesParams);
  });

  app.post(EndpointUrls.POST_IMAGES_BYANYHASHES, async (request): Promise<ItemsSourceResponse<ItemsReferenceList<Image>>> => {
    return app.itemsSource.getImagesByAnyHashes(request.body as GetImagesByAnyHashesParams);
  });

  app.post(EndpointUrls.POST_IMAGES_HASHESBYGROUPID, async (request): Promise<ItemsSourceTotalResponse<string>> => {
    return app.itemsSource.getHashesByGroupId(request.body as GetHashesByGroupIdParams);
  });

  app.post(EndpointUrls.POST_IMAGES_GROUPITEMSBYGROUPID, async (request): Promise<ItemsSourceResponse<GroupItem>> => {
    return app.itemsSource.getGroupItemsByGroupId(request.body as GetGroupItemsByGroupIdParams);
  });

  app.post(EndpointUrls.POST_IMAGES_UPDATE, async (request): Promise<void> => {
    return app.itemsSource.updateImages(request.body as UpdateImagesParams);
  });

  app.post(EndpointUrls.POST_IMAGES_DELETE, async (request): Promise<void> => {
    return app.itemsSource.deleteImagesByHashes(request.body as DeleteImagesByHashesParams);
  });
};

export default imagesRoutes;
