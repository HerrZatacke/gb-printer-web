import { useCallback, useMemo } from 'react';
import { getQueryClient } from '@/contexts/QueryClient';
import { useTracking } from '@/contexts/TrackingContext';
import { useImportExportSettings } from '@/hooks/useImportExportSettings';
import { usePlugins } from '@/hooks/usePlugins';
import { useStores } from '@/hooks/useStores';
import { pluginsByUrlsQueryOptions } from '@/stores/queries/plugins';
import { useInteractionsStore, useProgressStore } from '@/stores/stores';
import { nextPowerOfTwo } from '@/tools/nextPowerOfTwo';
import {
  type InitPluginSetupParams,
  type PluginClassInstance,
  type PluginImageData,
  type PluginsContext,
} from '@/types/Plugin';
import { collectImageData } from './functions/collectImageData';
import { initPlugin } from './functions/initPlugin';

export const useContextHook = (): PluginsContext => {
  const { updatePlugins, updatePluginState } = usePlugins({});
  const stores = useStores();
  const { startProgress, setProgress, stopProgress } = useProgressStore();
  const { setError } = useInteractionsStore();
  const { jsonImport } = useImportExportSettings();
  const { sendEvent } = useTracking();

  const initPluginSetupParams = useMemo<InitPluginSetupParams>(() => ({
    collectImageData,
    updatePluginState,
    startProgress,
    setProgress,
    stopProgress,
    setError,
    stores,
    importFn: jsonImport,
  }), [updatePluginState, startProgress, setProgress, stopProgress, setError, stores, jsonImport]);

  const getInstance = useMemo(() => async (url: string): Promise<PluginClassInstance | null> => {
    const queryClient = getQueryClient();
    const { items: [plugin] } = await queryClient.fetchQuery(pluginsByUrlsQueryOptions([url]));

    if (!plugin) {
      throw new Error(`Plugin with url "${url}" not found`);
    }
    return initPlugin(initPluginSetupParams, plugin);
  }, [initPluginSetupParams]);

  const validateAndAddPlugin = useCallback(async (url: string): Promise<boolean> => {
    const pluginInstance = await initPlugin(initPluginSetupParams, {
      url,
      name: '',
      description: '',
    });

    if (!pluginInstance) {
      return false;
    }

    await updatePlugins([{
      url,
      description: pluginInstance.description,
      name: pluginInstance.name,
      config: pluginInstance.config,
      configParams: pluginInstance.configParams,
    }]);

    return true;
  }, [initPluginSetupParams, updatePlugins]);


  const runWithImage = useCallback(async (url: string, imageHash: string): Promise<void> => {
    const pluginImage: PluginImageData = await collectImageData(imageHash);
    (await getInstance(url))?.withImage(pluginImage);
    sendEvent('runPlugin', { imageCount: 1 });
  }, [getInstance, sendEvent]);

  const runWithImages = useCallback(async (url: string, imageSelection: string[]): Promise<void> => {
    const pluginImages: PluginImageData[] = await Promise.all(imageSelection.map(collectImageData));
    if (!pluginImages.length) { return; }
    (await getInstance(url))?.withSelection(pluginImages);
    sendEvent('runPlugin', { imageCount: nextPowerOfTwo(pluginImages.length) });
  }, [getInstance, sendEvent]);

  return {
    validateAndAddPlugin,
    runWithImage,
    runWithImages,
  };
};
