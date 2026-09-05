import {
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';
import { anonymousOwner } from '@/db/schema/consts';

export const binaryImages = sqliteTable('binary_images', {
  key: text('key').primaryKey(),
  owner: text('owner').notNull().default(anonymousOwner),
  value: text('value').notNull(),
});
