import {
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';
import { anonymousOwner } from '@/db/schema/consts';

export const binaryFrames = sqliteTable('binary_frames', {
  key: text('key').primaryKey(),
  owner: text('owner').notNull().default(anonymousOwner),
  value: text('value').notNull(),
});
