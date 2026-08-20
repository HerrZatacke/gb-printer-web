import path from 'node:path';
import { fileURLToPath } from 'node:url';
import AutoLoad from '@fastify/autoload';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import Fastify from 'fastify';
import { runMigrations } from '@/db/connections';
import itemsSourcePlugin from '@/plugins/itemsSourcePlugin';

const app = Fastify({
  logger: true,
  bodyLimit: 10 * 1024 * 1024, // 10MB
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
void app.register(itemsSourcePlugin);
void app.register(fastifyStatic, { root: path.join(__dirname, '../public') });
void app.register(AutoLoad, { dir: path.join(__dirname, 'routes') });
await app.register(cors, {
  origin: (origin, cb) => {
    const allowed = ['https://app.example.com', 'http://localhost:3000'];
    if (!origin || allowed.includes(origin)) {
      cb(null, true);
      return;
    }
    cb(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
});

const start = async () => {
  try {
    await runMigrations();
    await app.listen({ port: 3001, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

void start();
