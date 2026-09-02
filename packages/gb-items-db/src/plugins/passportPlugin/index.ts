import fastifyPassport from '@fastify/passport';
import fastifySecureSession from '@fastify/secure-session';
import { Strategy as DiscordStrategy, DiscordScope } from 'discord-strategy';
import { type FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface PassportUser {
    id: string;
  }
}

const publicPathPrefixes = [
  '/health', // healthcheck
  '/auth', // static pages for login/logout/sessions
  '/gb-items-db', // static assets for local html files (non-webapp)
  '/fav', // manifest, favicon, etc...
];

export default fp(async (app: FastifyInstance) => {
  const sessionSecretKey = process.env.SESSION_SECRET_KEY;
  const isDevMode = process.env.NODE_ENV === 'development';
  const appPublicOrigin = process.env.GB_ITEMS_PUBLIC_ORIGIN || '';
  const discordClientId = process.env.DISCORD_CLIENT_ID;
  const discordClientSecret = process.env.DISCORD_CLIENT_SECRET;
  const allowedUserIds = (process.env.DISCORD_ALLOWED_USER_IDS || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  const discordCallbackUrl = '/auth/discord/callback';

  if (!discordClientId || !discordClientSecret) {
    app.log.warn('[auth] Discord OAuth2 environment variables are not set — running without authentication.');
    return;
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

    if (publicPathPrefixes.some((prefix) => requestPath.startsWith(prefix))) {
      return;
    }

    if (!request.isAuthenticated()) {
      response.redirect('/auth');
    }
  });

  app.get(
    '/auth/discord',
    { preValidation: fastifyPassport.authenticate('discord') },
    async () => {},
  );

  app.get(
    discordCallbackUrl,
    {
      preValidation: fastifyPassport.authenticate('discord', {
        successRedirect: '/',
        failureRedirect: '/auth/failed',
      }),
    },
    async () => {},
  );

  app.get('/auth/logout', async (request, response) => {
    await request.logOut();
    request.session.delete();
    return response.sendFile('auth/logout/index.html');
  });
});
