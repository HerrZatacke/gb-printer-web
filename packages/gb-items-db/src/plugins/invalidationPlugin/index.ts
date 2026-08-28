import fastifyWebsocket from '@fastify/websocket';
import { type FastifyPluginAsync, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import  { type ItemsMutationReponse } from 'gb-printer-schemas';
import { type WebSocket } from 'ws';
import { EndpointUrls } from '@/endpointUrls';

type Invalidator = {
  broadcastInvalidations: (request: FastifyRequest, payload: Promise<ItemsMutationReponse>) => void;
};

declare module 'fastify' {
  interface FastifyInstance {
    invalidation: Invalidator;
  }
}

const invalidationPlugin: FastifyPluginAsync = async (app) => {
  await app.register(fastifyWebsocket);

  const clients = new Map<string, WebSocket>();

  const broadcastInvalidations = async (request: FastifyRequest, payload: Promise<ItemsMutationReponse>): Promise<void> => {
    try {
      const invalidationResponse= JSON.stringify(await payload);
      const clientId = request.headers['x-client-id'] as string | undefined;

      for (const [id, socket] of clients) {
        if (id === clientId) {
          continue;
        }
        if (socket.readyState === socket.OPEN) {
          socket.send(invalidationResponse);
        }
      }
    } catch (error) {
      app.log.error(error);
    }
  };

  app.decorate('invalidation', { broadcastInvalidations });

  app.get(EndpointUrls.WS_INVALIDATIONS, { websocket: true }, (socket, req) => {
    const { clientId } = req.query as { clientId?: string };

    if (!clientId) {
      socket.close();
      return;
    }

    clients.set(clientId, socket);

    socket.on('close', () => {
      clients.delete(clientId);
    });
  });
};

export default fp(invalidationPlugin);
