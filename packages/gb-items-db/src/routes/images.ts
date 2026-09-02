import { type FastifyPluginAsync } from 'fastify';
import {
  type DeleteImagesByHashesParams,
  type GetGroupItemsByGroupIdParams,
  type GetHashesByGroupIdParams,
  type GetImagesByHashesParams,
  type GetImagesParams,
  type GroupItem,
  type Image,
  type ItemsSourceResponse,
  type ItemsSourceTotalResponse,
  type UpdateImagesParams,
  type ItemsMutationReponse,
} from 'gb-printer-schemas';
import { EndpointUrls } from '@/endpointUrls';

const imagesRoutes: FastifyPluginAsync = async (app) => {
  app.post(EndpointUrls.POST_IMAGES, async (request): Promise<ItemsSourceResponse<Image>> => {
    return app.createItemsSource(request.user?.id).getImages(request.body as GetImagesParams);
  });

  app.post(EndpointUrls.POST_IMAGES_TAGS, async (request): Promise<ItemsSourceTotalResponse<string>> => {
    return app.createItemsSource(request.user?.id).getAllTags();
  });

  app.post(EndpointUrls.POST_IMAGES_BYHASHES, async (request): Promise<ItemsSourceResponse<Image>> => {
    return app.createItemsSource(request.user?.id).getImagesByHashes(request.body as GetImagesByHashesParams);
  });

  app.post(EndpointUrls.POST_IMAGES_HASHESBYGROUPID, async (request): Promise<ItemsSourceTotalResponse<string>> => {
    return app.createItemsSource(request.user?.id).getHashesByGroupId(request.body as GetHashesByGroupIdParams);
  });

  app.post(EndpointUrls.POST_IMAGES_GROUPITEMSBYGROUPID, async (request): Promise<ItemsSourceResponse<GroupItem>> => {
    return app.createItemsSource(request.user?.id).getGroupItemsByGroupId(request.body as GetGroupItemsByGroupIdParams);
  });

  app.post(EndpointUrls.POST_IMAGES_UPDATE, async (request): Promise<ItemsMutationReponse> => {
    const response = app.createItemsSource(request.user?.id).updateImages(request.body as UpdateImagesParams);
    void app.invalidation.broadcastInvalidations(request, response);
    return response;
  });

  app.post(EndpointUrls.POST_IMAGES_DELETE, async (request): Promise<ItemsMutationReponse> => {
    const response = app.createItemsSource(request.user?.id).deleteImagesByHashes(request.body as DeleteImagesByHashesParams);
    void app.invalidation.broadcastInvalidations(request, response);
    return response;
  });
};

export default imagesRoutes;
