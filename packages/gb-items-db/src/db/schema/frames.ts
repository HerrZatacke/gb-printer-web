import {
  sqliteTable,
  integer,
  text,
  index,
} from 'drizzle-orm/sqlite-core';
import { anonymousOwner } from '@/db/schema/consts';

export const frames = sqliteTable('frames', {
  id: text('id').primaryKey(),
  owner: text('owner').notNull().default(anonymousOwner),
  hash: text('hash').notNull(),
  name: text('name').notNull(),
  lines: integer('lines').notNull().default(360),
}, (table) => [
  index('idx_frames_hash').on(table.hash),
]);
