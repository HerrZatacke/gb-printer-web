'use client';

import React, { useCallback, useMemo } from 'react';
import type { PropsWithChildren } from 'react';
import { useImportExportSettings } from '@/hooks/useImportExportSettings';
import { useStores } from '@/hooks/useStores';
import useInteractionsStore from '@/stores/interactionsStore';
import useItemsStore from '@/stores/itemsStore';
import type { InitPluginSetupParams, Plugin, PluginClassInstance, PluginImageData, PluginsContext } from '@/types/Plugin';
import { getCollectImageData } from './functions/collectImageData';
import { initPlugin } from './functions/initPlugin';
import { pluginsContext } from './index';

export function PluginsContext({ children }: PropsWithChildren) {
  const { plugins, images, addUpdatePluginProperties } = useItemsStore();
  const stores = useStores();
  const { startProgress, setProgress, stopProgress } = useInteractionsStore();
  const { jsonImport } = useImportExportSettings();

  const initPluginSetupParams = useMemo<InitPluginSetupParams>(() => ({
    collectImageData: getCollectImageData(images),
    addUpdatePluginProperties,
    startProgress,
    setProgress,
    stopProgress,
    stores,
    importFn: jsonImport,
  }), [images, addUpdatePluginProperties, startProgress, setProgress, stopProgress, stores, jsonImport]);

  const getInstance = useMemo(() => async (url: string): Promise<PluginClassInstance | null> => {
    const plugin: Plugin = plugins.find((p) => p.url === url) || { url: '' };
    return initPlugin(initPluginSetupParams, plugin);
  }, [initPluginSetupParams, plugins]);

  const validateAndAddPlugin = useCallback(async (plugin: Plugin): Promise<boolean> => (
    !!(await initPlugin(initPluginSetupParams, plugin))
  ), [initPluginSetupParams]);


  const contextValue = useMemo<PluginsContext>(() => ({
    runWithImage: async (url: string, imageHash: string): Promise<void> => {
      const pluginImage: PluginImageData = getCollectImageData(images)(imageHash);
      (await getInstance(url))?.withImage(pluginImage);
    },
    runWithImages: async (url: string, imageSelection: string[]): Promise<void> => {
      const pluginImages: PluginImageData[] = imageSelection.map(getCollectImageData(images));
      (await getInstance(url))?.withSelection(pluginImages);
    },
    validateAndAddPlugin,
  }), [getInstance, images, validateAndAddPlugin]);

  return (
    <pluginsContext.Provider value={contextValue}>
      { children }
    </pluginsContext.Provider>
  );
}
