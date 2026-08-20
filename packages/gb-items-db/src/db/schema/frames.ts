import {
  sqliteTable,
  integer,
  text,
} from 'drizzle-orm/sqlite-core';

export const frames = sqliteTable('frames', {
  id: text('id').primaryKey(),
  hash: text('hash').notNull(),
  name: text('name').notNull(),
  lines: integer('lines').notNull().default(360),
});
