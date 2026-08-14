import {
  PluginSchema,
  type DeletePluginsByUrlsParams,
  type GetPluginsByUrlsParams,
  type ItemsSourceResponse,
  type ItemsSourceTotalResponse,
  type Plugin,
  type UpdatePluginsParams,
} from 'gb-printer-schemas';
import z from 'zod';
import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { getAddPaging, getAddTotal } from '@/workers/itemsIndexedDbWorker/queries/helpers/generic';

export const getPlugins = async (): Promise<ItemsSourceTotalResponse<Plugin>> => {
  const { plugins: repository } = await getDb();
  const start = performance.now();

  const plugins = await repository.getAll();
  const total = await repository.count();

  const addPaging = getAddTotal<Plugin>(total, start, PluginSchema);

  return addPaging(plugins);
};

export const getPluginsByUrls = async ({ urls }: GetPluginsByUrlsParams): Promise<ItemsSourceResponse<Plugin>> => {
  const { plugins: repository } = await getDb();
  const start = performance.now();

  const total = await repository.count();

  const plugins = (await repository.getEntriesByKeys(urls))
    .map(({ value }) => value);

  const filteredPlugins = plugins.filter((plugin): plugin is Plugin => Boolean(plugin));

  const addPaging = getAddPaging<Plugin>(total, 0, plugins.length, start, PluginSchema);

  return addPaging(filteredPlugins);
};

export const updatePlugins = async ({ plugins, purge }: UpdatePluginsParams): Promise<void> => {
  const parsedPlugins = z.array(PluginSchema).parse(plugins);
  const { plugins: repository } = await getDb();

  if (purge) {
    await repository.clear();
  }

  await repository.put(
    parsedPlugins.map((plugin) => ({
      key: plugin.url,
      value: plugin,
    })),
  );
};

export const deletePluginsByUrls = async ({ urls }: DeletePluginsByUrlsParams): Promise<void> => {
  const { plugins: repository } = await getDb();
  await repository.deleteByKeys(urls);
};

