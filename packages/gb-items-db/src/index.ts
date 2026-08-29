import path from 'node:path';
import { fileURLToPath } from 'node:url';
import AutoLoad from '@fastify/autoload';
import cors, { type FastifyCorsOptions } from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import Fastify, { type FastifyRequest } from 'fastify';
import { runMigrations } from '@/db/connections';
import invalidationPlugin from '@/plugins/invalidationPlugin';
import itemsSourcePlugin from '@/plugins/itemsSourcePlugin';

const allowedOrigins = String(process.env.GB_ITEMS_DB_ALLOWED_ORIGINS || '').split(',');
const isDevMode = process.env.NODE_ENV === 'development';
const appPort = Number(process.env.GB_ITEMS_DB_PORT || '0');

const app = Fastify({
  logger: isDevMode ? {  level: 'debug' } : { level: 'info' },
  bodyLimit: 10 * 1024 * 1024, // 10MB
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
void app.register(invalidationPlugin);
void app.register(itemsSourcePlugin);
void app.register(fastifyStatic, { root: path.join(__dirname, '../public') });
void app.register(AutoLoad, { dir: path.join(__dirname, 'routes') });
await app.register(cors, () => (req: FastifyRequest, callback: (err: Error | null, options: FastifyCorsOptions) => void) => {
  const { origin } = req.headers;

  if (!origin) {
    callback(null, { origin: true, credentials: true });
    return;
  }

  const originHost = new URL(origin).host;
  if (originHost === req.headers.host || allowedOrigins.includes(origin)) {
    callback(null, { origin: true, credentials: true });
    return;
  }

  callback(new Error('Not allowed by CORS'), { origin: false, credentials: true });
});

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
