import  { type Plugin } from '@/types/Plugin';
import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { getAddPaging } from '@/workers/itemsIndexedDbWorker/queries/queryHelpers';
import { ItemsSourceResponse } from '@/workers/itemsIndexedDbWorker/types';

export const getPlugins = async (): Promise<ItemsSourceResponse<Plugin>> => {
  const db = await getDb();
  const { store } = db.transaction('plugins');
  const plugins = await store.getAll();
  const total = await store.count();

  const addPaging = getAddPaging<Plugin>(total, 0, plugins.length);

  return addPaging(plugins);
};

export const getPluginsByUrls = async (urls: string[]): Promise<ItemsSourceResponse<Plugin>> => {
  const db = await getDb();
  const { store } = db.transaction('plugins');
  const total = await store.count();

  const plugins = await Promise.all(
    urls.map(url => store.get(url)),
  );

  const filteredPlugins = plugins.filter((plugin): plugin is Plugin => Boolean(plugin));

  const addPaging = getAddPaging<Plugin>(total, 0, plugins.length);

  return addPaging(filteredPlugins);
};
