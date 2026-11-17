import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fastifyJwt from '@fastify/jwt';
import fastifyPassport from '@fastify/passport';
import fastifySecureSession from '@fastify/secure-session';
import { Strategy as DiscordStrategy, DiscordScope } from 'discord-strategy';
import { type FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { allowedOrigins } from '@/plugins/corsPlugin';

declare module 'fastify' {
  interface PassportUser {
    id: string;
  }
  interface FastifyRequest {
    jwtUser: { sub: string };
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: { id: string };
  }
}

const JWT_EXPIRY = '10m';

const publicPathPrefixes = [
  '/health', // healthcheck
  '/auth', // static pages for login/logout/sessions
  '/gb-items-db', // static assets for local html files (non-webapp)
  '/fav', // manifest, favicon, etc...
];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tokenPopupTemplatePath = path.join(__dirname, '../../../public/auth/token/index.html');

export default fp(async (app: FastifyInstance) => {
  const sessionSecretKey = process.env.SESSION_SECRET_KEY;
  const isDevMode = process.env.NODE_ENV === 'development';
  const appPublicOrigin = process.env.GB_ITEMS_PUBLIC_ORIGIN || '';
  const discordClientId = process.env.DISCORD_CLIENT_ID;
  const discordClientSecret = process.env.DISCORD_CLIENT_SECRET;
  const jwtSecret = process.env.JWT_SECRET;
  const allowedUserIds = (process.env.DISCORD_ALLOWED_USER_IDS || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  const discordCallbackUrl = '/auth/discord/callback';

  const authEnabled = Boolean(discordClientId && discordClientSecret);

  app.decorate('authEnabled', authEnabled);

  app.get('/auth/status', async () => {
    return { authEnabled };
  });

  if (!authEnabled || !discordClientId || !discordClientSecret) {
    app.log.warn('[auth] Discord OAuth2 environment variables are not set — running without authentication.');
    return;
  }

  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  if (!appPublicOrigin) {
    throw new Error('GB_ITEMS_PUBLIC_ORIGIN environment variable is not set');
  }

  if (!sessionSecretKey) {
    throw new Error('SESSION_SECRET_KEY environment variable is not set');
  }

  await app.register(fastifySecureSession, {
    key: Buffer.from(sessionSecretKey, 'hex'),
    cookie: {
      path: '/',
      httpOnly: true,
      secure: !isDevMode,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  });

  await app.register(fastifyJwt, {
    secret: jwtSecret,
    decoratorName: 'jwtUser',
  });

  fastifyPassport.use(
    'discord',
    new DiscordStrategy(
      {
        authorizationURL: 'https://discord.com/api/oauth2/authorize',
        tokenURL: 'https://discord.com/api/oauth2/token',
        clientID: discordClientId,
        clientSecret: discordClientSecret,
        callbackURL: `${appPublicOrigin}${discordCallbackUrl}`,
        scope: [DiscordScope.Identify, DiscordScope.Email],
      },
      async (accessToken, refreshToken, profile, done) => {
        if (allowedUserIds.length > 0 && !allowedUserIds.includes(profile.id)) {
          done(null, false);
          return;
        }

        done(null, { id: `discord:${profile.id}` });
      },
    ),
  );

  fastifyPassport.registerUserSerializer(async (user: { id: string }) => {
    return user.id;
  });

  fastifyPassport.registerUserDeserializer(async (id: string) => {
    return { id };
  });

  await app.register(fastifyPassport.initialize());
  await app.register(fastifyPassport.secureSession());

  app.addHook('preValidation', async (request, response) => {
    const requestPath = request.url.split('?')[0];
    const { origin } = request.query as { origin?: string };

    if (publicPathPrefixes.some((prefix) => requestPath.startsWith(prefix))) {
      return;
    }

    if (request.isAuthenticated()) {
      return;
    }

    if (request.headers.authorization) {
      try {
        await request.jwtVerify();
        request.user = { id: request.jwtUser.sub };
        return;
      } catch {
        response.code(401).send({ error: 'Unauthorized' });
        return;
      }
    }

    if (request.headers['x-client-id']) {
      response.code(401).send({ error: 'Unauthorized' });
      return;
    }

    response.redirect(origin ? `/auth?origin=${origin}` : '/auth');
  });

  app.get<{ Querystring: { origin?: string } }>('/auth/token', async (request, response) => {
    if (!request.isAuthenticated()) {
      const { origin } = request.query as { origin?: string };
      response.redirect(origin ? `/auth?origin=${origin}` : '/auth');
    }

    const requestedOrigin = request.query.origin;

    if (!requestedOrigin || !allowedOrigins.includes(requestedOrigin)) {
      return response.code(400).send({ error: 'Invalid or missing origin' });
    }

    const token = await app.jwt.sign({ sub: request.user.id }, { expiresIn: JWT_EXPIRY });

    const template = await readFile(tokenPopupTemplatePath, 'utf-8');
    const html = template
      .replace('__TOKEN__', token)
      .replace('__ORIGIN__', requestedOrigin);

    return response.type('text/html').send(html);
  });

  app.get('/auth/token/refresh', async (request, response) => {
    if (request.isAuthenticated()) {
      const token = await app.jwt.sign({ sub: request.user.id }, { expiresIn: JWT_EXPIRY });
      return response.send({ token });
    }

    try {
      await request.jwtVerify();
    } catch {
      return response.code(401).send({ error: 'Unauthorized' });
    }

    const token = await app.jwt.sign({ sub: request.jwtUser.sub }, { expiresIn: JWT_EXPIRY });
    return response.send({ token });
  });

  app.get(
    '/auth/discord',
    {
      preValidation: [
        async (request) => {
          const { origin } = request.query as { origin?: string };

          console.log({
            origin,
            allowedOrigins,
            returnTo: `/auth/token?origin=${encodeURIComponent(origin ||'')}`,
          });

          if (origin && allowedOrigins.includes(origin)) {
            console.log('setting returnTo value');
            request.session.set('returnTo', `/auth/token?origin=${encodeURIComponent(origin)}`);
          }
        },
        fastifyPassport.authenticate('discord'),
      ],
    },
    async () => {},
  );

  app.get(
    discordCallbackUrl,
    {
      preValidation: fastifyPassport.authenticate(
        'discord',
        async (request, reply, err, user) => {
          if (err || !user) {
            return reply.redirect('/auth/failed');
          }

          const returnTo = request.session.get('returnTo');
          await request.logIn(user);
          return reply.redirect(returnTo || '/');
        },
      ),
    },
    async () => {},
  );

  app.get('/auth/logout', async (request, response) => {
    await request.logOut();
    request.session.delete();
    return response.sendFile('auth/logout/index.html');
  });
});
