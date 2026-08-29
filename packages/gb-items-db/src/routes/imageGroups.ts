import { type FastifyPluginAsync } from 'fastify';
import {
  type ItemsSourceTotalResponse,
  type SerializableImageGroup,
  type TreeImageGroup,
  type RootItemSourceResponse,
  type DeleteImageGroupsByIdsParams,
  type UpdateImageGroupsParams,
  type ItemsMutationReponse,
} from 'gb-printer-schemas';
import { EndpointUrls } from '@/endpointUrls';

const imageGroupsRoutes: FastifyPluginAsync = async (app) => {
  app.post(EndpointUrls.POST_IMAGEGROUPS_LIST, async (): Promise<ItemsSourceTotalResponse<SerializableImageGroup>> => {
    return app.createItemsSource('unknown').getImageGroupsList();
  });

  app.post(EndpointUrls.POST_IMAGEGROUPS_TREE, async (): Promise<RootItemSourceResponse<TreeImageGroup>> => {
    return app.createItemsSource('unknown').getImageGroupsFullTree();
  });

  app.post(EndpointUrls.POST_IMAGEGROUPS_UPDATE, async (request): Promise<ItemsMutationReponse> => {
    const response = app.createItemsSource('unknown').updateImageGroups(request.body as UpdateImageGroupsParams);
    void app.invalidation.broadcastInvalidations(request, response);
    return response;
  });

  app.post(EndpointUrls.POST_IMAGEGROUPS_DELETE, async (request): Promise<ItemsMutationReponse> => {
    const response = app.createItemsSource('unknown').deleteImageGroupsByIds(request.body as DeleteImageGroupsByIdsParams);
    void app.invalidation.broadcastInvalidations(request, response);
    return response;
  });

};

export default imageGroupsRoutes;
