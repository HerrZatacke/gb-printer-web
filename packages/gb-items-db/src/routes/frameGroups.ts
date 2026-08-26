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
  app.post(EndpointUrls.POST_FRAMEGROUPS, async (): Promise<ItemsSourceTotalResponse<FrameGroup>> => {
    return app.itemsSource.getFrameGroups();
  });

  app.post(EndpointUrls.POST_FRAMEGROUPS_UPDATE, async (request): Promise<ItemsMutationReponse> => {
    return app.itemsSource.updateFrameGroups(request.body as UpdateFrameGroupsParams);
  });

  app.post(EndpointUrls.POST_FRAMEGROUPS_DELETE, async (request): Promise<ItemsMutationReponse> => {
    return app.itemsSource.deleteFrameGroupsByIds(request.body as DeleteFrameGroupsByIdsParams);
  });

};

export default frameGroupsRoutes;
