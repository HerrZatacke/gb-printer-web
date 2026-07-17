import z from 'zod';
import { type Plugin, PluginSchema } from '@/types/Plugin';
import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { getAddPaging } from '@/workers/itemsIndexedDbWorker/queries/helpers/generic';
import { type ItemsSourceResponse } from '@/workers/itemsIndexedDbWorker/types';

export const getPlugins = async (): Promise<ItemsSourceResponse<Plugin>> => {
  const db = await getDb();
  const start = performance.now();

  const { store } = db.transaction('plugins');
  const plugins = await store.getAll();
  const total = await store.count();

  const addPaging = getAddPaging<Plugin>(total, 0, plugins.length, start, PluginSchema);

  return addPaging(plugins);
};

export const getPluginsByUrls = async (urls: string[]): Promise<ItemsSourceResponse<Plugin>> => {
  const db = await getDb();
  const start = performance.now();

  const { store } = db.transaction('plugins');
  const total = await store.count();

  const plugins = await Promise.all(
    urls.map(url => store.get(url)),
  );

  const filteredPlugins = plugins.filter((plugin): plugin is Plugin => Boolean(plugin));

  const addPaging = getAddPaging<Plugin>(total, 0, plugins.length, start, PluginSchema);

  return addPaging(filteredPlugins);
};

export const updatePlugins = async (plugins: Plugin[]): Promise<void> => {
  const { success, data: parsedPlugins, error } = z.array(PluginSchema).safeParse(plugins);
  if (success) {
    const db = await getDb();

    const tx = db.transaction('plugins', 'readwrite');
    const store = tx.store;

    await Promise.all(parsedPlugins.map((palette) => store.put(palette)));
    await tx.done;
  } else {
    console.error(error);
  }
};

export const deletePluginsByUrls = async (urls: string[]): Promise<void> => {
const db = await getDb();

  const tx = db.transaction('plugins', 'readwrite');
  const store = tx.store;

  await Promise.all(urls.map((url) => store.delete(url)));
  await tx.done;
};

