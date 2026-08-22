import { type FastifyPluginAsync } from 'fastify';
import {
  type ItemsSourceTotalResponse,
  type ItemsSourceResponse,
  type GetBinaryItemsByHashesParams,
  type UpdateBinaryItemsParams,
  type DeleteBinaryItemsByHashesParams,
  type BinaryStoreItem,
} from 'gb-printer-schemas';
import { EndpointUrls } from '@/endpointUrls';

const binaryFramesRoutes: FastifyPluginAsync = async (app) => {
  app.post(EndpointUrls.POST_BINARYFRAMES_BYHASHES, async (request): Promise<ItemsSourceResponse<BinaryStoreItem>> => {
    return app.itemsSource.getBinaryFramesByHashes(request.body as GetBinaryItemsByHashesParams);
  });

  app.post(EndpointUrls.POST_BINARYFRAMES_HASHES, async (): Promise<ItemsSourceTotalResponse<string>> => {
    return app.itemsSource.getBinaryFrameHashes();
  });

  app.post(EndpointUrls.POST_BINARYFRAMES_UPDATE, async (request): Promise<void> => {
    return app.itemsSource.updateBinaryFrames(request.body as UpdateBinaryItemsParams);
  });

  app.post(EndpointUrls.POST_BINARYFRAMES_DELETE, async (request): Promise<void> => {
    return app.itemsSource.deleteBinaryFramesByHashes(request.body as DeleteBinaryItemsByHashesParams);
  });
};

export default binaryFramesRoutes;
