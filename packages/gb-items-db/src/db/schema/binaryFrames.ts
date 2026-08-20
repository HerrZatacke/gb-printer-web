import {
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const binaryFrames = sqliteTable('binary_frames', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});
