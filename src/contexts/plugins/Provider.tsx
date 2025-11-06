'use client';

import React, { useCallback, useMemo } from 'react';
import type { PropsWithChildren } from 'react';
import useTracking from '@/contexts/TrackingContext';
import { useImportExportSettings } from '@/hooks/useImportExportSettings';
import { useStores } from '@/hooks/useStores';
import useInteractionsStore from '@/stores/interactionsStore';
import useItemsStore from '@/stores/itemsStore';
import useProgressStore from '@/stores/progressStore';
import { nextPowerOfTwo } from '@/tools/nextPowerOfTwo';
import type { InitPluginSetupParams, Plugin, PluginClassInstance, PluginImageData, PluginsContext } from '@/types/Plugin';
import { getCollectImageData } from './functions/collectImageData';
import { initPlugin } from './functions/initPlugin';
import { pluginsContext } from './index';

export function PluginsContext({ children }: PropsWithChildren) {
  const { plugins, images, addUpdatePluginProperties } = useItemsStore();
  const stores = useStores();
  const { startProgress, setProgress, stopProgress } = useProgressStore();
  const { setError } = useInteractionsStore();
  const { jsonImport } = useImportExportSettings();
  const { sendEvent } = useTracking();

  const initPluginSetupParams = useMemo<InitPluginSetupParams>(() => ({
    collectImageData: getCollectImageData(images),
    addUpdatePluginProperties,
    startProgress,
    setProgress,
    stopProgress,
    setError,
    stores,
    importFn: jsonImport,
  }), [images, addUpdatePluginProperties, startProgress, setProgress, stopProgress, setError, stores, jsonImport]);

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
      sendEvent('runPlugin', { imageCount: 1 });
    },
    runWithImages: async (url: string, imageSelection: string[]): Promise<void> => {
      const pluginImages: PluginImageData[] = imageSelection.map(getCollectImageData(images));
      if (!pluginImages.length) { return; }
      (await getInstance(url))?.withSelection(pluginImages);
      sendEvent('runPlugin', { imageCount: nextPowerOfTwo(pluginImages.length) });
    },
    validateAndAddPlugin,
  }), [getInstance, images, sendEvent, validateAndAddPlugin]);

  return (
    <pluginsContext.Provider value={contextValue}>
      { children }
    </pluginsContext.Provider>
  );
}
