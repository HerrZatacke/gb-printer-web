import {
  primaryKey,
  index,
  sqliteTable,
  integer,
  text,
} from 'drizzle-orm/sqlite-core';
import {
  Rotation,
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
  // CommonImage properties
  hash: text('hash').primaryKey(),
  created: text('created'),
  title: text('title'),
  frame: text('frame'),
  tags: text('tags', { mode: 'json' }).default([]).$type<string[]>(),
  lockFrame: integer('lock_frame', { mode: 'boolean' }),
  rotation: integer('rotation').$type<Rotation>(),
  meta: text('meta', { mode: 'json' }).$type<ImageMetadata>(),

  // Different properties for MonochromeImage and RGBNImage
  type: text('type', { enum: ['mono', 'rgbn'] }).notNull(),
  palette: text('palette', { mode: 'json' }).$type<string | RGBNPalette>(),

  // MonochromeImage properties
  lines: integer('lines'),
  invertPalette: integer('invert_palette', { mode: 'boolean' }),
  framePalette: text('frame_palette'),
  invertFramePalette: integer('invert_frame_palette', { mode: 'boolean' }),

  // RGBNImage properties
  hashes: text('hashes', { mode: 'json' }).$type<RGBNHashes>(),

  // StoredImage
  referencedHashes: text('referenced_hashes', { mode: 'json' }).default([]).$type<string[]>(),
  specialTags: text('special_tags', { mode: 'json' }).default([]).$type<string[]>(),
});

export const imageReferences = sqliteTable('image_references', {
  sourceHash: text('source_hash').notNull().references(() => images.hash, { onDelete: 'cascade' }),
  referencedHash: text('referenced_hash').notNull(),
}, (table) => [
  primaryKey({ columns: [table.sourceHash, table.referencedHash] }),
  index('idx_image_references_referenced_hash').on(table.referencedHash),
]);

export const imageTags = sqliteTable('image_tags', {
  imageHash: text('image_hash').notNull().references(() => images.hash, { onDelete: 'cascade' }),
  tag: text('tag').notNull(),
}, (table) => [
  primaryKey({ columns: [table.imageHash, table.tag] }),
  index('idx_image_tags_tag').on(table.tag),
]);
