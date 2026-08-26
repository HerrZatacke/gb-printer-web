import {
  PluginSchema,
  type DeletePluginsByUrlsParams,
  type GetPluginsByUrlsParams,
  type ItemsSourceResponse,
  type ItemsSourceTotalResponse,
  type Plugin,
  type UpdatePluginsParams,
  type ItemsMutationReponse,
} from 'gb-printer-schemas';
import z from 'zod';
import { getAddPaging, getAddTotal, getMutationReponse } from '@/queries/helpers/generic';
import { type ItemsSourceInternal } from '@/types';

export async function getPlugins(this: ItemsSourceInternal): Promise<ItemsSourceTotalResponse<Plugin>> {
  const { plugins: repository } = this.repositories;
  const start = performance.now();

  const plugins = await repository.getAll();
  const total = await repository.count();

  const addPaging = getAddTotal<Plugin>(total, start, PluginSchema);

  return addPaging(plugins);
}

export async function getPluginsByUrls(this: ItemsSourceInternal, { urls }: GetPluginsByUrlsParams): Promise<ItemsSourceResponse<Plugin>> {
  const { plugins: repository } = this.repositories;
  const start = performance.now();

  const total = await repository.count();

  const plugins = (await repository.getEntriesByKeys(urls))
    .map(({ value }) => value);

  const filteredPlugins = plugins.filter((plugin): plugin is Plugin => Boolean(plugin));

  const addPaging = getAddPaging<Plugin>(total, 0, plugins.length, start, PluginSchema);

  return addPaging(filteredPlugins);
}

export async function updatePlugins(this: ItemsSourceInternal, { plugins, purge }: UpdatePluginsParams): Promise<ItemsMutationReponse> {
  const mutationReponse = getMutationReponse(performance.now());
  const parsedPlugins = z.array(PluginSchema).parse(plugins);
  const { plugins: repository } = this.repositories;

  if (purge) {
    await repository.clear();
  }

  await repository.put(
    parsedPlugins.map((plugin) => ({
      key: plugin.url,
      value: plugin,
    })),
  );
  return mutationReponse([]);
}

export async function deletePluginsByUrls(this: ItemsSourceInternal, { urls }: DeletePluginsByUrlsParams): Promise<ItemsMutationReponse> {
  const mutationReponse = getMutationReponse(performance.now());
  const { plugins: repository } = this.repositories;
  await repository.deleteByKeys(urls);
  return mutationReponse([]);
}
