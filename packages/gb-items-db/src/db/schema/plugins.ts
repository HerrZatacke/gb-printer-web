import {
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const plugins = sqliteTable('plugins', {
  url: text('url').primaryKey(),
  config: text('config', { mode: 'json' }),
  name: text('name').notNull().default(''),
  description: text('description').notNull().default(''),
  configParams: text('config_params', { mode: 'json' }),
});
