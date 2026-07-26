import { type QueryClient } from '@tanstack/react-query';
import { getItemsSource } from '@/items/client';
import { STALE_TIME } from '@/stores/queries/consts';
import { Plugin } from '@/types/Plugin';

const baseKeys = ['items', 'plugins'] as const;

export const pluginsKeys = {
  all: baseKeys,
  list: [...baseKeys, 'list'] as const,
  byUrls: (urls: string[]) => [...baseKeys, 'byUrls', [...urls].sort()] as const,
};

export const pluginsListQueryOptions = () => {
  return {
    queryKey: pluginsKeys.list,
    queryFn: async () => {
      const source = await getItemsSource();
      return source.getPlugins();
    },
    staleTime: STALE_TIME,
  };
};

// ToDo: add batched loader
export const pluginsByUrlsQueryOptions = (urls: string[]) => {
  return {
    queryKey: pluginsKeys.byUrls(urls),
    queryFn: async () => {
      const source = await getItemsSource();
      return source.getPluginsByUrls(urls || []);
    },
    staleTime: STALE_TIME,
  };
};

export const updatePluginsAction = async (queryClient: QueryClient, plugins: Plugin[], purge = false): Promise<void> => {
  const source = await getItemsSource();
  await source.updatePlugins(plugins, purge);
  await queryClient.invalidateQueries({ queryKey: pluginsKeys.all });
};

export const deletePluginsByUrlsAction = async (queryClient: QueryClient, deleteUrls: string[]): Promise<void> => {
  const source = await getItemsSource();
  await source.deletePluginsByUrls(deleteUrls);
  await queryClient.invalidateQueries({ queryKey: pluginsKeys.all });
};
