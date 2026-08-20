import {
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const binaryImages = sqliteTable('binary_images', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});
