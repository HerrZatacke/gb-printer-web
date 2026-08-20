import { type FastifyPluginAsync } from 'fastify';
import {
  type ItemsSourceTotalResponse,
  type ItemsSourceResponse,
  type GetBinaryItemsByHashesParams,
  type UpdateBinaryItemsParams,
  type DeleteBinaryItemsByHashesParams,
  type BinaryStoreItem,
} from 'gb-printer-schemas';

const binaryFramesRoutes: FastifyPluginAsync = async (app) => {
  app.post('/binaryFrames/byHashes', async (request): Promise<ItemsSourceResponse<BinaryStoreItem>> => {
    return app.itemsSource.getBinaryFramesByHashes(request.body as GetBinaryItemsByHashesParams);
  });

  app.post('/binaryFrames/hashes', async (): Promise<ItemsSourceTotalResponse<string>> => {
    return app.itemsSource.getBinaryFrameHashes();
  });

  app.post('/binaryFrames/update', async (request): Promise<void> => {
    return app.itemsSource.updateBinaryFrames(request.body as UpdateBinaryItemsParams);
  });

  app.post('/binaryFrames/delete', async (request): Promise<void> => {
    return app.itemsSource.deleteBinaryFramesByHashes(request.body as DeleteBinaryItemsByHashesParams);
  });
};

export default binaryFramesRoutes;
