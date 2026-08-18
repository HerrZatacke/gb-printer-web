import { type FastifyPluginAsync } from 'fastify';
import {
  type ItemsSourceTotalResponse,
  type SerializableImageGroup,
  type TreeImageGroup,
  type RootItemSourceResponse,
  type DeleteImageGroupsByIdsParams,
  type UpdateImageGroupsParams,
} from 'gb-printer-schemas';
import {  } from 'gb-printer-schemas/dist/schemas/items/ImageGroup';
import {  } from 'gb-printer-schemas/dist/schemas/api/Responses';
import {  } from 'gb-printer-schemas/dist/schemas/types';

const imagesRoutes: FastifyPluginAsync = async (app) => {
  app.post('/imageGroups/list', async (): Promise<ItemsSourceTotalResponse<SerializableImageGroup>> => {
    return app.itemsSource.getImageGroupsList();
  });

  app.post('/imageGroups/tree', async (): Promise<RootItemSourceResponse<TreeImageGroup>> => {
    return app.itemsSource.getImageGroupsFullTree();
  });

  app.post('/imageGroups/update', async (request): Promise<void> => {
    return app.itemsSource.updateImageGroups(request.body as UpdateImageGroupsParams);
  });

  app.post('/imageGroups/delete', async (request): Promise<void> => {
    return app.itemsSource.deleteImageGroupsByIds(request.body as DeleteImageGroupsByIdsParams);
  });

};

export default imagesRoutes;
