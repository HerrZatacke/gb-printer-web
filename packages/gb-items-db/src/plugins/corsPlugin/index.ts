import cors, {
  type  FastifyCorsOptions,
  type  FastifyCorsOptionsDelegate,
} from '@fastify/cors';
import  { type FastifyInstance, type FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

const allowedOrigins = String(process.env.GB_ITEMS_DB_ALLOWED_ORIGINS || '').split(',');

const resolveCorsOptions: FastifyCorsOptionsDelegate = () => (req: FastifyRequest, callback: (err: Error | null, options: FastifyCorsOptions) => void) => {
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
};

export const corsPlugin = fp(async (app: FastifyInstance): Promise<void> => {
  await app.register(cors, resolveCorsOptions);
});
