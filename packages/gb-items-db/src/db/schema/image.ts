import {
  primaryKey,
  index,
  sqliteTable,
  integer,
  text,
} from 'drizzle-orm/sqlite-core';
import {
  type Rotation,
} from 'gb-image-decoder';
import {
  type RGBNHashes,
  type RGBNPalette,
  type ImageMetadata,
} from 'gb-printer-schemas';

// ---- Drizzle table — this is what `drizzle-kit generate` reads ----
// id is app-generated (z.string(), e.g. a UUID or hash you create yourself),
// so no .primaryKey({ autoIncrement: true }) — that's only for integer ids
// SQLite generates for you.
export const images = sqliteTable('images', {
  hash: text('hash').primaryKey(),
  hashes: text('hashes', { mode: 'json' }).$type<RGBNHashes>(),
  created: text('created').notNull(),
  title: text('title').notNull(),
  frame: text('frame'),
  tags: text('tags', { mode: 'json' }).notNull().$type<string[]>(),
  type: text('type', { enum: ['mono', 'rgbn'] }).notNull(),
  lines: integer('lines'),
  palette: text('palette', { mode: 'json' }).$type<string | RGBNPalette>(),
  invertPalette: integer('invert_palette', { mode: 'boolean' }).notNull().default(false),
  invertFramePalette: integer('invert_frame_palette', { mode: 'boolean' }).notNull().default(false),
  framePalette: text('frame_palette'),
  lockFrame: integer('lock_frame', { mode: 'boolean' }).notNull().default(false),
  meta: text('meta', { mode: 'json' }).$type<ImageMetadata>(),
  rotation: integer('rotation').$type<Rotation>(),
});

export const imageReferences = sqliteTable('image_references', {
  sourceHash: text('source_hash').notNull().references(() => images.hash, { onDelete: 'cascade' }),
  referencedHash: text('referenced_hash').notNull(),
}, (table) => [
  primaryKey({ columns: [table.sourceHash, table.referencedHash] }),
  index('idx_image_references_referenced_hash').on(table.referencedHash),
]);
