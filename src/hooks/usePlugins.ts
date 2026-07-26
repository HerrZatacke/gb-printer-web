import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import {
  pluginsByUrlsQueryOptions,
  pluginsListQueryOptions,
  updatePluginsAction,
  deletePluginsByUrlsAction,
} from '@/stores/queries/plugins';
import { Plugin, type PluginConfigValues } from '@/types/Plugin';
import { ItemsSourcePaging } from '@/workers/itemsIndexedDbWorker/types';

export interface PluginState {
  loading: boolean;
  error: string | false;
}

export interface UsePlugins {
  plugins: Plugin[];
  paging: ItemsSourcePaging | null;
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
    await updatePluginsAction(queryClient, plugins, purge);
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
    await deletePluginsByUrlsAction(queryClient, deleteUrls);
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
    paging: listQuery.data?.paging ?? null,
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
