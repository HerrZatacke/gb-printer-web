# gb-items-db

`gb-items-db` is the SQLite-backed backend service for gb-printer-web.    

## Architecture
* Built with Fastify, better-sqlite3, and Drizzle ORM
* It exposes a REST API that implements the `ItemsSource` interface shared across this project.  
* Real-time cache invalidation is handled via WebSocket.

## Docker image
`gb-items-db` is designed to be self-hostable by non-technical users and is deployed via Docker, with images [published to GHCR](https://ghcr.io/herrzatacke/gb-items-db).

## Authentication Session secret

`gb-items-db` uses `@fastify/secure-session` to encrypt session cookies. This requires a
32-byte secret key, provided as a 64-character hex string in the `SESSION_SECRET_KEY`
environment variable.

### Generating a key

Run this once to generate a key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the printed 64-character hex string and use it as environment variable:
```env
SESSION_SECRET_KEY=<paste the 64-character hex string here>
```

> **Note:** The key must be exactly 64 hex characters (32 bytes). Anything shorter or longer will cause the server to fail on startup.

### Rotating the key
Changing `SESSION_SECRET_KEY` invalidates all existing sessions which causes every logged-in user
to be signed out.
