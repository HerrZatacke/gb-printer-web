import {
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';
import { anonymousOwner } from '@/db/schema/consts';

export const frameGroups = sqliteTable('frame_groups', {
  id: text('id').primaryKey(),
  owner: text('owner').notNull().default(anonymousOwner),
  name: text('name').notNull(),
});
