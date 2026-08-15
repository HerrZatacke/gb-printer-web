import fs from 'node:fs';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

fs.mkdirSync('./database', { recursive: true });

const sqlite = new Database('./database/items.db');
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite);

export const runMigrations = async (): Promise<void> => {
  await migrate(db, { migrationsFolder: './drizzle' });
};
