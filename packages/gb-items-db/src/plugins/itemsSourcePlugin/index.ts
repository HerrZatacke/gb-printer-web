import { type FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { ItemsSourceApi, type ItemsSource } from 'gb-items-source';
import { db, sqlite } from '@/db/connections';
import { createRepositories } from '@/repository/createRepositories';

declare module 'fastify' {
  interface FastifyInstance {
    itemsSource: ItemsSource;
  }
}

const itemsSourcePlugin: FastifyPluginAsync = async (app) => {
  const repositories = createRepositories(db, sqlite);
  const instance = new ItemsSourceApi(repositories) as unknown as ItemsSource;
  app.decorate('itemsSource', instance);
};

export default fp(itemsSourcePlugin);
