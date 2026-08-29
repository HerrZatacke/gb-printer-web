# ---- Base ----
FROM node:24-alpine AS base
RUN apk add --no-cache python3 make g++
RUN corepack enable
WORKDIR /app

# ---- Dependencies (full monorepo, for build) ----
FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.json ./
COPY patches ./patches
COPY packages/gb-printer-schemas/package.json ./packages/gb-printer-schemas/
COPY packages/gb-items-source/package.json ./packages/gb-items-source/
COPY packages/gb-items-db/package.json ./packages/gb-items-db/
RUN pnpm install --frozen-lockfile

# ---- Build ----
FROM deps AS build
COPY packages/gb-printer-schemas ./packages/gb-printer-schemas
COPY packages/gb-items-source ./packages/gb-items-source
COPY packages/gb-items-db ./packages/gb-items-db
RUN pnpm --filter gb-printer-schemas build
RUN pnpm --filter gb-items-source build
RUN pnpm --filter gb-items-db build

# ---- Production dependencies only ----
FROM base AS prod-deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY patches ./patches
COPY packages/gb-printer-schemas/package.json ./packages/gb-printer-schemas/
COPY packages/gb-items-source/package.json ./packages/gb-items-source/
COPY packages/gb-items-db/package.json ./packages/gb-items-db/
RUN pnpm install --frozen-lockfile --prod

# ---- Runtime ----
FROM node:24-alpine AS runtime
WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/packages/gb-printer-schemas/node_modules ./packages/gb-printer-schemas/node_modules
COPY --from=prod-deps /app/packages/gb-items-source/node_modules ./packages/gb-items-source/node_modules
COPY --from=prod-deps /app/packages/gb-items-db/node_modules ./packages/gb-items-db/node_modules

COPY --from=build /app/packages/gb-printer-schemas/dist ./packages/gb-printer-schemas/dist
COPY --from=build /app/packages/gb-printer-schemas/package.json ./packages/gb-printer-schemas/
COPY --from=build /app/packages/gb-items-source/dist ./packages/gb-items-source/dist
COPY --from=build /app/packages/gb-items-source/package.json ./packages/gb-items-source/
COPY --from=build /app/packages/gb-items-db/dist ./packages/gb-items-db/dist
COPY --from=build /app/packages/gb-items-db/package.json ./packages/gb-items-db/
COPY --from=build /app/packages/gb-items-db/public ./packages/gb-items-db/public
COPY --from=build /app/packages/gb-items-db/drizzle ./packages/gb-items-db/drizzle

WORKDIR /app/packages/gb-items-db

EXPOSE 3001

CMD ["node", "dist/index.js"]
