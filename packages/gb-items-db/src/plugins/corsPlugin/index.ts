import cors, {
  type  FastifyCorsOptions,
  type  FastifyCorsOptionsDelegate,
} from '@fastify/cors';
import  { type FastifyInstance, type FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export const allowedOrigins = String(process.env.GB_ITEMS_DB_ALLOWED_ORIGINS || '').split(',');
const allowedHeaders = ['Content-Type', 'x-client-id', 'Authorization'];

const resolveCorsOptions: FastifyCorsOptionsDelegate = () => (req: FastifyRequest, callback: (err: Error | null, options: FastifyCorsOptions) => void) => {
  const { origin } = req.headers;

  if (!origin) {
    callback(null, { origin: true, credentials: true, allowedHeaders  });
    return;
  }

  const originHost = new URL(origin).host;
  if (originHost === req.headers.host || allowedOrigins.includes(origin)) {
    callback(null, { origin: true, credentials: true, allowedHeaders  });
    return;
  }

  callback(new Error('Not allowed by CORS'), { origin: false, credentials: true });
};

export const corsPlugin = fp(async (app: FastifyInstance): Promise<void> => {
  await app.register(cors, resolveCorsOptions);
});
