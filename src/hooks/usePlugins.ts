import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { getItemsSource } from '@/items/client';
import {
  pluginsKeys,
  pluginsByUrlsQueryOptions,
  pluginsListQueryOptions,
} from '@/stores/queries/plugins';
import { Plugin, type PluginConfigValues } from '@/types/Plugin';

export interface PluginState {
  loading: boolean;
  error: string | false;
}

export interface UsePlugins {
  plugins: Plugin[];
  totalCount: number;
  isLoadingList: boolean;
  byUrls: Plugin[];
  isLoadingByUrls: boolean;
  updatePlugins: (plugins: Plugin[], purge?: boolean) => Promise<void>;
  deletePluginsByUrls: (urls: string[]) => Promise<void>;
  updatePluginConfig: (url: string, key: string, value: string | number) => Promise<void>;
  updatePluginState: (url: string, loading: boolean, error: string | false) => void;
  pluginStates: Map<string, PluginState>;
}

export interface UsePluginsOptions {
  list?: boolean;
  urls?: string[];
}

export const usePlugins = ({ list, urls }: UsePluginsOptions): UsePlugins => {
  const queryClient = useQueryClient();
  const [pluginStates, setPluginStates] = useState<Map<string, PluginState>>(new Map());

  const listQuery = useQuery({
    ...pluginsListQueryOptions(),
    enabled: Boolean(list),
    placeholderData: keepPreviousData,
    retry: false,
  });

  const byUrlsQuery = useQuery({
    ...pluginsByUrlsQueryOptions(urls || []),
    enabled: Boolean(urls?.length),
    placeholderData: keepPreviousData,
    retry: false,
  });

  const updatePlugins = useCallback(async (plugins: Plugin[], purge = false): Promise<void> => {
    const source = await getItemsSource();
    await source.updatePlugins(plugins, purge);
    await queryClient.invalidateQueries({ queryKey: pluginsKeys.all });
  }, [queryClient]);

  const updatePluginConfig = useCallback(async (url: string, key: string, value: string | number): Promise<void> => {
    const { items: [foundPlugin] } = await queryClient.fetchQuery(pluginsByUrlsQueryOptions([url]));

    if (!foundPlugin) {
      throw new Error(`Plugin "${url}" not found`);
    }

    let changedPlugin: Plugin = foundPlugin;

    const newConfigValues: PluginConfigValues = {
      ...(changedPlugin.config || {}),
      [key]: value,
    };

    changedPlugin = {
      ...changedPlugin,
      config: newConfigValues,
    };

    updatePlugins([changedPlugin]);
  }, [queryClient, updatePlugins]);

  const deletePluginsByUrls = useCallback(async (deleteUrls: string[]): Promise<void> => {
    const source = await getItemsSource();
    await source.deletePluginsByUrls(deleteUrls);
    await queryClient.invalidateQueries({ queryKey: pluginsKeys.all });
  }, [queryClient]);

  const updatePluginState = useCallback((url: string, loading: boolean, error: string | false) => {
    console.log('updatePluginState', {
      url,
      loading,
      error,
    });

    setPluginStates((prevStates) => {
      const newStates = new Map(prevStates);
      newStates.set(url, { loading, error });
      return newStates;
    });
  }, []);

  return {
    plugins: listQuery.data?.items ?? [],
    totalCount: listQuery.data?.paging?.total ?? 0,
    isLoadingList: listQuery.isLoading,

    byUrls: byUrlsQuery.data?.items ?? [],
    isLoadingByUrls: byUrlsQuery.isLoading,

    updatePlugins,
    deletePluginsByUrls,
    updatePluginConfig,
    updatePluginState,
    pluginStates,
  };
};
