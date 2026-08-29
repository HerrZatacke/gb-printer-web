import path from 'node:path';
import { fileURLToPath } from 'node:url';
import AutoLoad from '@fastify/autoload';
import fastifyStatic from '@fastify/static';
import Fastify from 'fastify';
import { runMigrations } from '@/db/connections';
import { corsPlugin } from '@/plugins/corsPlugin';
import invalidationPlugin from '@/plugins/invalidationPlugin';
import itemsSourcePlugin from '@/plugins/itemsSourcePlugin';

const isDevMode = process.env.NODE_ENV === 'development';
const appPort = Number(process.env.GB_ITEMS_DB_PORT || '0');

const app = Fastify({
  logger: isDevMode ? {  level: 'debug' } : { level: 'info' },
  bodyLimit: 10 * 1024 * 1024, // 10MB
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

void app.register(corsPlugin);
void app.register(invalidationPlugin);
void app.register(itemsSourcePlugin);
void app.register(fastifyStatic, { root: path.join(__dirname, '../public') });
void app.register(AutoLoad, { dir: path.join(__dirname, 'routes') });

const start = async () => {
  try {
    if (!appPort) {
      throw new Error('missing env values: GB_ITEMS_DB_PORT');
    }
    await runMigrations();
    await app.listen({ port: appPort, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

void start();
