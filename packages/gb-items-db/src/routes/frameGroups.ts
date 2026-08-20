import { type FastifyPluginAsync } from 'fastify';
import {
  type ItemsSourceTotalResponse,
  type FrameGroup,
  type UpdateFrameGroupsParams,
  type DeleteFrameGroupsByIdsParams,
} from 'gb-printer-schemas';

const frameGroupsRoutes: FastifyPluginAsync = async (app) => {
  app.post('/frameGroups', async (): Promise<ItemsSourceTotalResponse<FrameGroup>> => {
    return app.itemsSource.getFrameGroups();
  });

  app.post('/frameGroups/update', async (request): Promise<void> => {
    return app.itemsSource.updateFrameGroups(request.body as UpdateFrameGroupsParams);
  });

  app.post('/frameGroups/delete', async (request): Promise<void> => {
    return app.itemsSource.deleteFrameGroupsByIds(request.body as DeleteFrameGroupsByIdsParams);
  });

};

export default frameGroupsRoutes;
