# Game Boy Camera Gallery

Game Boy Camera Gallery is a web app to organise, edit and share shots taken with the Game Boy Camera.

## Standalone web version
Check the [published version on GitHub-Pages](https://herrzatacke.github.io/gb-printer-web/)

## Published Docker image _API ONLY_ (experimental)
You can run this image and use it's URL on the settings page to have a shared database.
> This is currently a __single user__ setup.  
> There is no password protection or authorization.  
> Use this image if you know what you are doing.

Build image and start containter locally
```bash
docker compose up -d --build --force-recreate
```

Use the published package (adjust env vars to your needs)
```bash
docker pull ghcr.io/herrzatacke/gb-items-db:latest

docker run -p 3001:3001 `
  -e GB_ITEMS_DB_ALLOWED_ORIGINS=https://herrzatacke.github.io/ `
  -e GB_ITEMS_DB_PORT=3001 `
  -e GB_ITEMS_PUBLIC_ORIGIN=https://your-domain.example `
  -e SESSION_SECRET_KEY=your-64-character-hex-key `
  -e DISCORD_CLIENT_ID=your-discord-client-id `
  -e DISCORD_CLIENT_SECRET=your-discord-client-secret `
  -e DISCORD_ALLOWED_USER_IDS=123456789012345678,234567890123456789 `
  -v gb-items-db-data:/app/packages/gb-items-db/database `
  ghcr.io/herrzatacke/gb-items-db:latest
```

### Variables
> If `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` are left unset, the app runs with no authentication at all — intended for setups where access is restricted some other way (e.g. a reverse proxy, VPN, or network-level restriction).

| Variable                      | Required                   | Description                                                                                                                                                                                                             |
|-------------------------------|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GB_ITEMS_DB_ALLOWED_ORIGINS` | Yes                        | Comma-separated list of origins allowed to make CORS requests to the API (e.g. the URL your frontend is hosted at).                                                                                                     |
| `GB_ITEMS_DB_PORT`            | Yes                        | Port the server listens on inside the container.                                                                                                                                                                        |
| `GB_ITEMS_PUBLIC_ORIGIN`      | Only if using Discord auth | The public URL the app is reachable at (e.g. `https://your-domain.example`). Used to build the Discord OAuth2 callback URL.                                                                                             |
| `SESSION_SECRET_KEY`          | Only if using Discord auth | 32-byte hex key used to encrypt session cookies. Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Keep this secret and stable — changing it invalidates all existing sessions. |
| `DISCORD_CLIENT_ID`           | Only if using Discord auth | Client ID from your Discord application, used to initiate the OAuth2 login flow.                                                                                                                                        |
| `DISCORD_CLIENT_SECRET`       | Only if using Discord auth | Client secret from your Discord application. Keep this secret.                                                                                                                                                          |
| `DISCORD_ALLOWED_USER_IDS`    | No                         | Comma-separated whitelist of Discord user IDs allowed to log in. Leave unset to allow any Discord account.                                                                                                              |

## Workspace

This repository is a pnpm workspace containing the packages that make up gb-printer-web.

## Getting started

Install dependencies from the repo root:

```bash
    pnpm install
```
Start dev mode
  ```bash
      pnpm dev
  ```
Build the main project
  ```bash
      pnpm  build
  ```

## Packages

- [`packages/gb-printer-web`](./packages/gb-printer-web) — The main application
- [`packages/gb-printer-schemas`](./packages/gb-printer-schemas) — Holding schemas and types for cross-project item types  
- [`packages/gb-items.source`](./packages/gb-items.source) — The transport-agnostic query and mutation logic

## License

See [LICENSE](./LICENSE).
