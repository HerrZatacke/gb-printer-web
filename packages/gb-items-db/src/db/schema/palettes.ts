import {
  sqliteTable,
  integer,
  text,
} from 'drizzle-orm/sqlite-core';

export const palettes = sqliteTable('palettes', {
  shortName: text('short_name').primaryKey(),
  name: text('name').notNull(),
  palette: text('palette', { mode: 'json' }).notNull().$type<string[]>(),
  origin: text('origin').notNull().default(''),
  isPredefined: integer('is_predefined', { mode: 'boolean' }).notNull().default(false),
});
