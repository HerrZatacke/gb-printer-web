# Items Worker Migration — Context Summary (v2)

Reference doc for resuming this work in a fresh conversation. Written for "future Claude": states real current shape where confirmed, and says what to ask for where it isn't.

## Project & Goal

Next.js/TypeScript app (`gb-printer-web`), migrating from Zustand + localForage to: **Web Worker(owns IndexedDB via `idb`) + Comlink (RPC transport) + TanStack Query (client cache)**. Local-only today; the explicit end goal is a self-hostable Docker API the same client can talk to instead — every abstraction is deliberately transport-agnostic. Scale: self-hosted per user/small group, no multi-tenant concerns.

## Real File/Module Map

| Path                                                                                                            | Description                                                                                                                                                                              |
|-----------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| src/contexts/QueryClient/index.tsx                                                                              | QueryClient singleton + <QueryClientProvider>                                                                                                                                            |
| src/items/client.ts                                                                                             | getItemsSource() — worker singleton, hostApi wiring                                                                                                                                      |
| src/stores/queries/*.ts                                                                                         | query-option factories + xKeys, PER ITEM TYPE: batchedLoader.ts (generic factory), consts.ts (STALE_TIME), frameGroups.ts, frames.ts, imageGroups.ts, images.ts, palettes.ts, plugins.ts |
| src/hooks/use*.ts                                                                                               | React hooks wrapping the above (usePalettes, useImages, useImageGroups, useFrames, useFrameGroups, usePlugins, etc.)                                                                     |
| src/workers/itemsIndexedDbWorker/types.ts                                                                       | ItemsDB schema, ItemsSource interface, FilterStep, etc.                                                                                                                                  |
| src/workers/itemsIndexedDbWorker/db.ts                                                                          | getDb()/getHostApi() singletons, migration runner, maintenance runner                                                                                                                    |
| src/workers/itemsIndexedDbWorker/index.ts                                                                       | Comlink.expose(api) — the worker entry point                                                                                                                                             |
| src/workers/itemsIndexedDbWorker/migrations/v1.ts, v1LegacyData.ts                                              | schema creation + legacy data import                                                                                                                                                     |
| src/workers/itemsIndexedDbWorker/maintenance/types.ts                                                           |                                                                                                                                                                                          |
| src/workers/itemsIndexedDbWorker/maintenance/populateGroupAggregatedTags.ts                                     |                                                                                                                                                                                          |
| src/workers/itemsIndexedDbWorker/queries/{images,imageGroups,frames,frameGroups,palettes,plugins,binaryData}.ts |                                                                                                                                                                                          |
| src/workers/itemsIndexedDbWorker/queries/helpers/applyFullSlugs.ts                                              | populate imageGroup-Tree                                                                                                                                                                 |                                                                                                                                                            
| src/workers/itemsIndexedDbWorker/queries/helpers/applyImageTotals.ts                                            | populate imageGroup-Tree                                                                                                                                                                 |                                                                                                                                                          
| src/workers/itemsIndexedDbWorker/queries/helpers/buildFilterSteps.ts                                            |                                                                                                                                                                                          |                                                                                                                                                          
| src/workers/itemsIndexedDbWorker/queries/helpers/buildTree.ts                                                   |                                                                                                                                                                                          |                                                                                                                                                                 
| src/workers/itemsIndexedDbWorker/queries/helpers/createTreeRoot.ts                                              |                                                                                                                                                                                          |                                                                                                                                                            
| src/workers/itemsIndexedDbWorker/queries/helpers/generic.ts                                                     | getAddPaging = <T>(total: number, page: number, pageSize: number, startTime: number, schema: ZodType<T>) => (sortedItems: T[]): ItemsSourceResponse<T>                                   |                                                                                                                                                                   
| src/workers/itemsIndexedDbWorker/queries/helpers/imagesKeyQueries.ts                                            |                                                                                                                                                                                          |                                                                                                                                                          
| src/workers/itemsIndexedDbWorker/queries/helpers/resolveAndFilterImages.ts                                      |                                                                                                                                                                                          |                                                                                                                                                    
| src/workers/itemsIndexedDbWorker/queries/helpers/resolveGroupItemsByGroupId.ts                                  |                                                                                                                                                                                          |                                                                                                                                                
| src/workers/itemsIndexedDbWorker/queries/helpers/resolveOwnership.ts                                            |                                                                                                                                                                                          |

## Core Architecture Layers

1. **Components** — never touch the worker/IndexedDB directly.
2. **Hooks** (`src/hooks/use*.ts`) — wrap `useQuery`/mutations, centralized per item type, lazily internal (`{ list?, tree?, bySlug?, shortNames? }`-style options, each gated by its own `enabled`).
3. **Query option factories** (`src/stores/queries/*.ts`) — `xKeys` + `xListQueryOptions()` / `xByYQueryOptions()`, shared between `useQuery` and `getQueryClient().fetchQuery`.
4. **`ItemsSource` interface** (`workers/itemsIndexedDbWorker/types.ts`) — transport-agnostic contract; worker-backed today, will *optionally* become HTTP-backed later, worker's IndexedDB becoming a read-through cache.
5. **Comlink-wrapped Worker**, reached via `getItemsSource()` in `src/items/client.ts` — module singleton on `globalThis.__itemsSourcePromise`, throws server-side, `await`s `init(...)`.
6. **Worker internals** — `db.ts` (idb singleton), migration array, per-item-type query files.

## Response Envelope (applies to every `ItemsSource` method)

Every read method — including batch-by-id/hash lookups, where paging is semantically meaningless — returns the same shape, produced by the shared `getAddPaging` helper:

```ts
export interface ItemsSourcePaging {
  filtered: number; total: number; page: number; pageSize: number; maxPageIndex: number;
}
export interface ItemsSourceResponse<T> {
  items: T[]; paging: ItemsSourcePaging; duration: number;
}
// tree-shaped single-item responses (getImageGroupsFullTree) use a sibling shape instead:
export interface RootItemSourceResponse<T> {
  item: T; totalCount: number; duration: number;
}
```

`getAddPaging<T>(total, page, pageSize, startTime, schema)` returns a function that slices, **re-parses every item through its domain zod schema**, and wraps the envelope. That re-parse is worth noting specifically: it's the actual mechanism that strips storage-only fields (like `StoredImage.referencedHashes`) back off before data leaves the worker — because zod's default `z.object()` behavior strips unrecognized keys, parsing a `StoredImage` through the plain `ImageSchema` silently drops `referencedHashes`. There is no separate `toDomainImage`-style stripping function; `getAddPaging` does it for every item type uniformly.

`createBatchedLoader`'s `fetchByKeys` param is typed `(keys: string[]) => Promise<ItemsSourceResponse<T>>` — The loader destructures `.items` internally and discards paging/duration, but the fetch function itself must return the full envelope for consistency with every other worker method.

## `ItemsHostApi` (worker → main-thread bridge)

```ts
export interface ItemsHostApi {
  getLegacyStorage(): Promise<Record<string, unknown[]>>;
  getRecentImports(): Promise<Set<string>>; // reads useFiltersStore.getState() — a deliberate permanent bridge point, not a phase-out target
  onDataChanged(): void; // no payload — always invalidates the top-level ['items'] key - needs implementation later
}
```

## Item Types & Stores (`ItemsDB`, abbreviated)

```ts
export interface ItemsDB extends DBSchema {
  binaryframes: { key: string; value: string };     // out-of-line key, raw frame bytes by hash
  binaryimages: { key: string; value: string };     // out-of-line key, raw image bytes by hash
  frames:       { key: string; value: Frame; indexes: { name: string; hash: string } };
  framegroups:  { key: string; value: FrameGroup };
  images:       { key: string; value: StoredImage; indexes: { created: string; frame: string; palette: string; tags: string; referencedHashes: string; title: string; type: string; } };
  imagegroups:  { key: string; value: SerializableImageGroup };
  palettes:     { key: string; value: Palette };    // keyPath: shortName
  plugins:      { key: string; value: Plugin };     // keyPath: url
}
```

Binary data (actual frame/image pixel bytes) is a **separate concern from metadata**, stored in its own out-of-line-key stores and queried independently.

Six item types now follow the established pattern end to end: **Images, ImageGroups, Frames, FrameGroups, Palettes, Plugins**. Chat only ever worked through Images/ImageGroups/Palettes in depth — Frames/FrameGroups/Plugins were extended by the user following the same shape, largely unassisted. If a task touches Frames/FrameGroups/Plugins specifically, ask for the current `queries/frames.ts` / `queries/frameGroups.ts` / `queries/plugins.ts` and their `stores/queries/*` counterparts, since chat has no detailed history with them.

`updateX(items, purge: boolean)` mutations all take a `purge` flag (clears the whole store first)
— a bulk-replace mode (`purge` parameter), for import/restore flows.

## `StoredImage` (worker-internal storage schema)

```ts
export const StoredImageSchema = z.discriminatedUnion('type', [
  MonochromeImageSchema, RGBNImageSchema,
]).transform((image) => ({
  ...image,
  referencedHashes: image.type === 'rgbn'
    ? Object.values(image.hashes ?? {}).filter((h): h is string => Boolean(h))
    : [],
}));
export type StoredImage = z.infer<typeof StoredImageSchema>;
```

Confirms: `RGBNImageSchema` has a `hashes: { r?, g?, b?, n? }`-shaped field (RGBN channel references); `MonochromeImageSchema` does not. `referencedHashes` is derived, indexed (`multiEntry`), worker-internal only — never on the domain `Image` type. This is exactly the pattern settled on in chat after a couple of wrong turns; it held.

`Image.ts` itself was barely touched by this migration (one generic-constraint fix to a `nullToValue` helper) — it's pre-existing app code. **Ask for the current `types/Image.ts` if a task needs the full domain schema** (all fields on `MonochromeImageSchema`/`RGBNImageSchema` beyond what's inferable from worker code: `hash`, `created`, `title`, `frame`, `tags`, `lockFrame`, `rotation`, `meta`, `palette`, `type`, `hashes` are all confirmed in use somewhere in the worker layer; there may be more).

## `ImageGroup` Types (current)

```ts
export const BaseImageGroupSchema = z.object({
  id: z.string(), slug: z.string(), created: z.string(), title: z.string(),
  isFavourite: z.boolean().prefault(false), coverImage: z.string(),
  images: z.array(z.string()),          // direct membership — group owns this, NOT groupId-on-image
  tags: z.array(z.string()).prefault([]),
});
export const SerializableImageGroupSchema = BaseImageGroupSchema.extend({
  groups: z.array(z.string()),
});
export interface TreeImageGroup extends BaseImageGroup {
  groups: TreeImageGroup[];
  totalImages: number;  // NaN until applyImageTotals runs; never persisted
  fullSlug: string;     // '' until applyFullSlugs runs; never persisted
}
```

Membership model is confirmed final: **groups own `images: string[]` and `groups: string[]` arrays; images do not carry a `groupId` field.** Ther is **no** `groupId`-on-image.

## Aggregates

**`tags`** — persisted, but recomputed for the *whole tree* once per worker session, not per-write:

```ts
// maintenance/populateGroupAggregatedTags.ts — runs inside openAndPrepareDb() after a database upgrade  — not on individual writes
const resolveGroupTags = (groupId, depth, groupsById, tagsByImageHash, resolvedTagsById) => {
  // depth-capped (MAX_TREE_DEPTH = 20) recursive union of own images' tags + all child groups' tags
};
export const populateGroupAggregatedTags = async (db) => {
  // loads ALL groups + ALL images, recomputes every group's tags, writes them all back
};
```

No dirty-tracking, no debounce, no write-hook exists. If a group's images/tags change mid-session, its stored `tags` field is stale until the next db upgrade. **needs implementation**

**`totalImages`** — never persisted at all; recomputed fresh, in-memory, on every `getImageGroupsFullTree()` call via `applyImageTotals` (post-order tree walk, cheap). Always accurate, at the cost of recomputing on every full-tree fetch (mitigated by TanStack caching upstream, same as before).

## Query Engine — `FilterStep` (current, confirmed) **To be refactored/simplified**

```ts
export type FilterStep =
  { kind: 'indexAny'; indexName: string; values: string[] } |   // OR-match — used for tags, palette, frame, type
  { kind: 'indexNone'; indexName: string } |                     // e.g. "untagged"
  { kind: 'indexRange'; indexName: 'created'; range: IDBKeyRange } | // e.g. "new" (last 24h)
  { kind: 'ids'; ids: Set<string> } |                            // e.g. "recent imports"
  { kind: 'predicate'; test: (image: Image) => boolean };        // e.g. hasComments/hasUsername
```

`indexAny` is used uniformly for every category including `tags` — **OR semantics everywhere, no AND-within-category anywhere in the shipped code.** `keysMatchingAll` exists in `imagesKeyQueries.ts` but is commented out/unused — kept as a reference for if AND-semantics are ever wanted back.

`ImageQueryFilters` (`{ tags?, palette?, frame? }`) covers direct index filters; everything else — untagged, new, monochrome/rgb type, recent-imports, favourite, has-comments, has-username — comes through a `SpecialTags` enum, translated per-value inside `buildFilterSteps`:

```ts
// consts/SpecialTags.ts — ask for the full file; known members from usage:
// FILTER_UNTAGGED, FILTER_NEW, FILTER_MONOCHROME, FILTER_RGB, FILTER_RECENT,
// FILTER_FAVOURITE, FILTER_COMMENTS, FILTER_USERNAME
```

`FILTER_FAVOURITE` confirms the "magic tag" approach discussed in chat: it becomes `{ kind: 'indexAny', indexName: 'tags', values: ['FILTER_FAVOURITE'] }` — favourite-ness is a literal reserved tag value, not a separate boolean field. `FILTER_RECENT` resolves via `hostApi.getRecentImports()` into an `'ids'` step. `FILTER_COMMENTS`/`FILTER_USERNAME` are `predicate` steps checking `image.meta?.comment` / `image.meta?.userName`.

Pipeline (`resolveAndFilterImages.ts`): build steps → resolve every non-predicate step to a `Set<string>` via `resolveKeyableStep` → `intersectAll` → load full records for the survivors (`getCandidates`, `store.get` per id, or `store.getAll()` if only predicates/no filters at all) → apply predicate steps last. Exactly the filter → sort → paginate discipline from chat, confirmed in the shipped code.

## `GroupItem` — group contents + child covers, merged (built differently than chat concluded)

Chat's last answer on "images of a group including child-group covers, sorted together" was: pass a combined id list into the existing image filter as `filters.ids`, and have the *client* know which returned ids are covers (since it already holds that from the tree). **What's actually built is more capable than that**, via a dedicated pipeline:

```ts
export const GroupItemSchema = z.object({
  image: ImageSchema,
  group: SerializableImageGroupSchema.nullable(), // set only when this entry represents a cover image
  title: z.string(),   // group.title if this is a cover, else image.title
  created: z.string(), // group.created if this is a cover, else image.created
  frame: z.string().nullable(),
  palette: z.string().nullable(),
});
```

`resolveGroupItemsByGroupId(db, hostApi, groupId, includeGroups, sort, filters)`:
1. Resolves the target group's own `images`/`groups` (root is special-cased via `getImageGroupsFullTree()`).
2. If `includeGroups`, collects child groups' `coverImage` hashes alongside own image hashes into one `Set`.
3. Runs that combined set through `resolveAndFilterImages` (filters still apply to covers too).
4. Maps each returned image to a `GroupItem`, attaching the owning `group` (found by `coverImage === image.hash`) when applicable, and computing effective `title`/`created`/ `frame`/`palette` that fall back to the **group's** values for cover entries — so a cover sorts/displays using the group's metadata, not the underlying image's.
5. Sorts the merged `GroupItem[]` by the requested field via a generic `sortBy` helper (`@/tools/sortby`).

Two worker methods expose this: `getGroupItemsByGroupId` (full `GroupItem[]`, paginated) and `getHashesByGroupId` (hashes only — lighter-weight variant for cases that don't need full objects yet). Neither was discussed in chat in this form; ask for `resolveGroupItemsByGroupId.ts` and `queries/images.ts` directly if a task touches group-content listing.

## Batched Loader (current, generalized)

```ts
export const createBatchedLoader = <T>(
  fetchByKeys: (keys: string[]) => Promise<ItemsSourceResponse<T>>,
  getKey: (item: T) => string,
  delay: number,   // 0 → queueMicrotask; >0 → setTimeout(flush, delay)
) => { /* returns { loadByKey } */ };
```

The `delay` param is new versus chat's design (which only used `queueMicrotask`). Loaders for now are configured with **`delay: 50`** (ms), not `0` — a deliberate widening of the coalescing window, addressing the "staggered mounts" caveat. 

## TanStack Layer Specifics (confirmed)

- `getQueryClient()` in `src/contexts/QueryClient/index.tsx` uses `environmentManager.isServer()` (current TanStack API, not a legacy/deprecated `isServer` export) — real, current, not a hallucination if seen again.
- `STALE_TIME = 60_000` (`stores/queries/consts.ts`), applied uniformly to every query options factory.
- `imagesByHashesQueryOptions` uses a `select` to **re-sort results into the caller's requested hash order**, since the underlying cache/batch layer doesn't guarantee order — worth the same treatment for any other by-key query where order matters to the caller.
- `warmImageCache(images)` — after any query that returns full `Image[]` (list, byGroupId, raw), each image is individually `setQueryData`'d into `imagesKeys.byHash(hash)`, pre-warming the single-image cache. Same principle as chat's batched-loader hydration idea, applied directly via `queryClient.setQueryData` instead.
- `imagesListQueryOptions` still loads the **entire** image collection unpaginated (`pageSize: 10000`), with an explicit `// ToDo: getting _all_ images without pagination must be eliminated for API` comment — i.e., the user is aware this doesn't survive the transition to a hosted API and has flagged it as a known remaining migration task, not an oversight.
- `imageGroupsFullTreeQueryOptions`/`findGroupByFullSlug` live in `stores/queries/imageGroups.ts` — confirms the `select`-over-shared-cache pattern for by-slug lookup was adopted as planned.

## Project/Tooling Notes

- `@tanstack/react-query` (`^5.101.2`) and `idb` (`^8.0.3`) are now real dependencies.

## Naming/Style Conventions

- Arrow functions everywhere `this` isn't needed.
- No `!=`/`==`; always `!==`/`===`.
- Curly braces + newlines always, even for one-line `if`/`for`/`while` bodies.
- When giving updated code for 1–2 changed spots, show only those lines, not the whole file.
- Don't flag unused variables — linter handles it.
- Worker-internal storage types must never leak into client-facing code.

## Still-Open / Unverified Items

- Debounced/dirty-tracked aggregate recompute — **not built** Ask before assuming staleness behavior matches the original design discussion.
- Cross-tab `BroadcastChannel` invalidation — **not built**
- `imagesListQueryOptions`'s unpaginated `pageSize: 10000` — known-acknowledged remaining migration debt (per the user's own `ToDo` comment), not yet addressed.

## What to Ask For When Resuming

- The specific `stores/queries/*.ts` and `hooks/use*.ts` pair for the item type in question — the pattern is consistent, but exact field names (e.g., `ImageQueryFilters`, `GroupItem`) vary.
- `src/types/Image.ts`, `Frame.ts`, `FrameGroup.ts`, `Plugin.ts` in full, if a task needs complete domain schemas — chat has only ever seen fragments of these via worker code.
- `src/consts/SpecialTags.ts` in full, if a task touches filtering — only inferred from usage here, not seen directly.
- Current state of `queries/binaryData.ts` and its call sites, if a task touches binary payloads — genuinely new territory, no chat history on this at all.
- Whether debounced tag recompute, `BroadcastChannel`, or thinned-tree search have been built since this doc was written — all three were open/missing as of this update.
