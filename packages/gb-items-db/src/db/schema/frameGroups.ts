import {
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const frameGroups = sqliteTable('frame_groups', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});
