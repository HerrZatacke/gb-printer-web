import { type FastifyPluginAsync } from 'fastify';
import {
  type ItemsSourceTotalResponse,
  type FrameGroup,
  type UpdateFrameGroupsParams,
  type DeleteFrameGroupsByIdsParams,
  type ItemsMutationReponse,
} from 'gb-printer-schemas';
import { EndpointUrls } from '@/endpointUrls';

const frameGroupsRoutes: FastifyPluginAsync = async (app) => {
  app.post(EndpointUrls.POST_FRAMEGROUPS, async (request): Promise<ItemsSourceTotalResponse<FrameGroup>> => {
    return app.createItemsSource(request.user?.id).getFrameGroups();
  });

  app.post(EndpointUrls.POST_FRAMEGROUPS_UPDATE, async (request): Promise<ItemsMutationReponse> => {
    const response = app.createItemsSource(request.user?.id).updateFrameGroups(request.body as UpdateFrameGroupsParams);
    void app.invalidation.broadcastInvalidations(request, response);
    return response;
  });

  app.post(EndpointUrls.POST_FRAMEGROUPS_DELETE, async (request): Promise<ItemsMutationReponse> => {
    const response = app.createItemsSource(request.user?.id).deleteFrameGroupsByIds(request.body as DeleteFrameGroupsByIdsParams);
    void app.invalidation.broadcastInvalidations(request, response);
    return response;
  });

};

export default frameGroupsRoutes;
