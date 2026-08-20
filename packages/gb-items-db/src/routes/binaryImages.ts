import { type FastifyPluginAsync } from 'fastify';
import {
  type ItemsSourceTotalResponse,
  type ItemsSourceResponse,
  type GetBinaryItemsByHashesParams,
  type UpdateBinaryItemsParams,
  type DeleteBinaryItemsByHashesParams,
  type BinaryStoreItem,
} from 'gb-printer-schemas';

const binaryImagesRoutes: FastifyPluginAsync = async (app) => {
  app.post('/binaryImages/byHashes', async (request): Promise<ItemsSourceResponse<BinaryStoreItem>> => {
    return app.itemsSource.getBinaryImagesByHashes(request.body as GetBinaryItemsByHashesParams);
  });

  app.post('/binaryImages/hashes', async (): Promise<ItemsSourceTotalResponse<string>> => {
    return app.itemsSource.getBinaryImageHashes();
  });

  app.post('/binaryImages/update', async (request): Promise<void> => {
    return app.itemsSource.updateBinaryImages(request.body as UpdateBinaryItemsParams);
  });

  app.post('/binaryImages/delete', async (request): Promise<void> => {
    return app.itemsSource.deleteBinaryImagesByHashes(request.body as DeleteBinaryItemsByHashesParams);
  });
};

export default binaryImagesRoutes;
