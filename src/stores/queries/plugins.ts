import { getItemsSource } from '@/items/client';

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
    staleTime: 30000,
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
    staleTime: 30000,
  };
};
