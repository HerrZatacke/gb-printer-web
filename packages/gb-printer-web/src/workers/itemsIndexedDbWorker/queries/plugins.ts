import z from 'zod';
import { type Plugin, PluginSchema } from '@/types/Plugin';
import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { getAddPaging, getAddTotal } from '@/workers/itemsIndexedDbWorker/queries/helpers/generic';
import {
  type DeletePluginsByUrlsParams,
  type GetPluginsByUrlsParams,
  type ItemsSourceResponse,
  type ItemsSourceTotalResponse,
  type UpdatePluginsParams,
} from '@/workers/itemsIndexedDbWorker/types';

export const getPlugins = async (): Promise<ItemsSourceTotalResponse<Plugin>> => {
  const db = await getDb();
  const start = performance.now();

  const { store } = db.transaction('plugins');
  const plugins = await store.getAll();
  const total = await store.count();

  const addPaging = getAddTotal<Plugin>(total, start, PluginSchema);

  return addPaging(plugins);
};

export const getPluginsByUrls = async ({ urls }: GetPluginsByUrlsParams): Promise<ItemsSourceResponse<Plugin>> => {
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

export const updatePlugins = async ({ plugins, purge }: UpdatePluginsParams): Promise<void> => {
  const parsedPlugins = z.array(PluginSchema).parse(plugins);

  const db = await getDb();

  const tx = db.transaction('plugins', 'readwrite');
  const store = tx.store;

  if (purge) {
    await store.clear();
  }

  await Promise.all(parsedPlugins.map((palette) => store.put(palette)));
  await tx.done;
};

export const deletePluginsByUrls = async ({ urls }: DeletePluginsByUrlsParams): Promise<void> => {
const db = await getDb();

  const tx = db.transaction('plugins', 'readwrite');
  const store = tx.store;

  await Promise.all(urls.map((url) => store.delete(url)));
  await tx.done;
};

