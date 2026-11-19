import {
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';
import { anonymousOwner } from '@/db/schema/consts';

export const plugins = sqliteTable('plugins', {
  url: text('url').primaryKey(),
  owner: text('owner').notNull().default(anonymousOwner),
  config: text('config', { mode: 'json' }),
  name: text('name').notNull().default(''),
  description: text('description').notNull().default(''),
  configParams: text('config_params', { mode: 'json' }),
});
