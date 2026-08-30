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
  app.post(EndpointUrls.POST_IMAGEGROUPS_LIST, async (request): Promise<ItemsSourceTotalResponse<SerializableImageGroup>> => {
    return app.createItemsSource(request.user?.id).getImageGroupsList();
  });

  app.post(EndpointUrls.POST_IMAGEGROUPS_TREE, async (request): Promise<RootItemSourceResponse<TreeImageGroup>> => {
    request.session.touch();
    return app.createItemsSource(request.user?.id).getImageGroupsFullTree();
  });

  app.post(EndpointUrls.POST_IMAGEGROUPS_UPDATE, async (request): Promise<ItemsMutationReponse> => {
    const response = app.createItemsSource(request.user?.id).updateImageGroups(request.body as UpdateImageGroupsParams);
    void app.invalidation.broadcastInvalidations(request, response);
    return response;
  });

  app.post(EndpointUrls.POST_IMAGEGROUPS_DELETE, async (request): Promise<ItemsMutationReponse> => {
    const response = app.createItemsSource(request.user?.id).deleteImageGroupsByIds(request.body as DeleteImageGroupsByIdsParams);
    void app.invalidation.broadcastInvalidations(request, response);
    return response;
  });

};

export default imageGroupsRoutes;
