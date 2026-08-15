# Game Boy Camera Gallery

Game Boy Camera Gallery is a web app to organise, edit and share shots taken with the Game Boy Camera.

Check the [published version on GitHub-Pages](https://herrzatacke.github.io/gb-printer-web/)

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
