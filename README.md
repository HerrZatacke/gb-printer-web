# Game Boy Camera Gallery

Game Boy Camera Gallery is a web app to organise, edit and share shots taken with the Game Boy Camera.

[Click Here For The Website](https://herrzatacke.github.io/gb-printer-web/)

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
  -v gb-items-db-data:/app/packages/gb-items-db/database `
  ghcr.io/herrzatacke/gb-items-db:latest
```

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
