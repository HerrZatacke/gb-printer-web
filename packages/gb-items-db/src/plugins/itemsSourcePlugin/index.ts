import { type FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { ItemsSourceApi, type ItemsSource, type Repositories } from 'gb-items-source';

declare module 'fastify' {
  interface FastifyInstance {
    itemsSource: ItemsSource;
  }
}

const itemsSourcePlugin: FastifyPluginAsync = async (app) => {
  const repositories = null as unknown as Repositories;
  const instance = new ItemsSourceApi(repositories) as unknown as ItemsSource;
  app.decorate('itemsSource', instance);
};

export default fp(itemsSourcePlugin);
