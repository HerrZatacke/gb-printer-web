import {
  sqliteTable,
  integer,
  text,
} from 'drizzle-orm/sqlite-core';
import { anonymousOwner } from '@/db/schema/consts';

export const palettes = sqliteTable('palettes', {
  shortName: text('short_name').primaryKey(),
  owner: text('owner').notNull().default(anonymousOwner),
  name: text('name').notNull(),
  palette: text('palette', { mode: 'json' }).notNull().$type<string[]>(),
  origin: text('origin').notNull().default(''),
  isPredefined: integer('is_predefined', { mode: 'boolean' }).notNull().default(false),
});
