import { type FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { ItemsSourceApi, type ItemsSource } from 'gb-items-source';
import { db } from '@/db/connections';
import { createRepositories } from '@/repository/createRepositories';

declare module 'fastify' {
  interface FastifyInstance {
    createItemsSource: (ownerId: string) => ItemsSource;
  }
}

const itemsSourcePlugin: FastifyPluginAsync = async (app) => {
  const createItemsSource = (ownerId: string) => {
    const repositories = createRepositories(db, ownerId);
    return new ItemsSourceApi(repositories) as unknown as ItemsSource;
  };

  app.decorate('createItemsSource', createItemsSource);
};

export default fp(itemsSourcePlugin);
