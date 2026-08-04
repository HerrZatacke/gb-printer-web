import { type QueryClient } from '@tanstack/react-query';
import { getQueryClient } from '@/contexts/QueryClient';
import { getItemsSource } from '@/stores/items/client';
import { createBatchedLoader } from '@/stores/items/queries/batchedLoader';
import { pluginsKeys } from '@/stores/items/queries/cacheKeys';
import { STALE_TIME } from '@/stores/items/queries/consts';
import { Plugin } from '@/types/Plugin';

const warmPluginCache = (plugins: Plugin[]) => {
  const queryClient = getQueryClient();
  plugins.forEach((plugin) => {
    queryClient.setQueryData(pluginsKeys.byUrl(plugin.url), plugin);
  });
};

export const pluginsByUrlsBatchedLoader = createBatchedLoader<Plugin>(
  async (urls: string[]) => {
    const source = await getItemsSource();
    const response = await source.getPluginsByUrls({ urls });
    return {
      duration: response.duration,
      total: response.paging.total,
      items: response.items,
    };
  },
  (plugin) => plugin.url,
  50,
);

export const pluginsListQueryOptions = () => {
  return {
    queryKey: pluginsKeys.list,
    queryFn: async () => {
      const source = await getItemsSource();
      const result = await source.getPlugins();

      warmPluginCache(result.items);
      return result;
    },
    staleTime: STALE_TIME,
  };
};

export const pluginsByUrlsQueryOptions = (urls: string[]) => {
  return {
    queryKey: pluginsKeys.byUrls(urls),
    queryFn: async () => {
      if (!urls?.length) {
        return { items: [] };
      }

      const results = await Promise.all(urls.map(pluginsByUrlsBatchedLoader.loadByKey));
      const items = results.filter((f): f is Plugin => Boolean(f));

      warmPluginCache(items);
      return { items };
    },
    select: (data: { items: Plugin[] }) => {
      const byUrl = new Map(data.items.map((plugin) => [plugin.url, plugin]));
      return {
        items: urls // sort result by this call's original order, not the cached one
          .map((url) => byUrl.get(url))
          .filter((plugin): plugin is Plugin => Boolean(plugin)),
      };
    },
    staleTime: STALE_TIME,
  };
};

export const pluginByUrlQueryOptions = (url: string) => ({
  queryKey: pluginsKeys.byUrl(url), // mostly populated by pluginsByUrls
  queryFn: async () => pluginsByUrlsBatchedLoader.loadByKey(url),
  staleTime: STALE_TIME,
});

export const updatePluginsAction = async (queryClient: QueryClient, plugins: Plugin[], purge = false): Promise<void> => {
  const source = await getItemsSource();
  await source.updatePlugins({ plugins, purge });
  await queryClient.invalidateQueries({ queryKey: pluginsKeys.all });
};

export const deletePluginsByUrlsAction = async (queryClient: QueryClient, deleteUrls: string[]): Promise<void> => {
  const source = await getItemsSource();
  await source.deletePluginsByUrls({ urls: deleteUrls });
  await queryClient.invalidateQueries({ queryKey: pluginsKeys.all });
};
