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
    return app.itemsSource.getImageGroupsList();
  });

  app.post(EndpointUrls.POST_IMAGEGROUPS_TREE, async (): Promise<RootItemSourceResponse<TreeImageGroup>> => {
    return app.itemsSource.getImageGroupsFullTree();
  });

  app.post(EndpointUrls.POST_IMAGEGROUPS_UPDATE, async (request): Promise<ItemsMutationReponse> => {
    return app.itemsSource.updateImageGroups(request.body as UpdateImageGroupsParams);
  });

  app.post(EndpointUrls.POST_IMAGEGROUPS_DELETE, async (request): Promise<ItemsMutationReponse> => {
    return app.itemsSource.deleteImageGroupsByIds(request.body as DeleteImageGroupsByIdsParams);
  });

};

export default imageGroupsRoutes;
