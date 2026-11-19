import {
  sqliteTable,
  integer,
  text,
} from 'drizzle-orm/sqlite-core';
import { anonymousOwner } from '@/db/schema/consts';

export const imageGroups = sqliteTable('image_groups', {
  id: text('id').primaryKey(),
  owner: text('owner').notNull().default(anonymousOwner),
  slug: text('slug').notNull(),
  created: text('created'),
  title: text('title'),
  isFavourite: integer('is_favourite', { mode: 'boolean' }),
  coverImage: text('cover_image'),
  images: text('images', { mode: 'json' }).default([]).$type<string[]>(),
  groups: text('groups', { mode: 'json' }).default([]).$type<string[]>(),
  tags: text('tags', { mode: 'json' }).default([]).$type<string[]>(),
  specialTags: text('special_tags', { mode: 'json' }).default([]).$type<string[]>(),
  palettes: text('palettes', { mode: 'json' }).default([]).$type<string[]>(),
  frames: text('frames', { mode: 'json' }).default([]).$type<string[]>(),
});
