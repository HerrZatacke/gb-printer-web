import { useCallback, useMemo } from 'react';
import { useTracking } from '@/contexts/TrackingContext';
import { useImportExportSettings } from '@/hooks/useImportExportSettings';
import { usePalettes } from '@/hooks/usePalettes';
import { useStores } from '@/hooks/useStores';
import {
  useInteractionsStore,
  useItemsStore,
  useProgressStore,
} from '@/stores/stores';
import { nextPowerOfTwo } from '@/tools/nextPowerOfTwo';
import {
  type InitPluginSetupParams,
  type Plugin,
  type PluginClassInstance,
  type PluginImageData,
  type PluginsContext,
} from '@/types/Plugin';
import { getCollectImageData } from './functions/collectImageData';
import { initPlugin } from './functions/initPlugin';

export const useContextHook = (): PluginsContext => {
  const { plugins, images, frames, addUpdatePluginProperties } = useItemsStore();
  const { palettes } = usePalettes({ list: true });
  const stores = useStores();
  const { startProgress, setProgress, stopProgress } = useProgressStore();
  const { setError } = useInteractionsStore();
  const { jsonImport } = useImportExportSettings();
  const { sendEvent } = useTracking();

  const initPluginSetupParams = useMemo<InitPluginSetupParams>(() => ({
    collectImageData: getCollectImageData(images, palettes, frames),
    addUpdatePluginProperties,
    startProgress,
    setProgress,
    stopProgress,
    setError,
    stores,
    importFn: jsonImport,
  }), [images, palettes, frames, addUpdatePluginProperties, startProgress, setProgress, stopProgress, setError, stores, jsonImport]);

  const getInstance = useMemo(() => async (url: string): Promise<PluginClassInstance | null> => {
    const plugin: Plugin | undefined = plugins.find((p) => p.url === url);
    if (!plugin) {
      throw new Error(`Plugin with url "${url}" not found`);
    }
    return initPlugin(initPluginSetupParams, plugin);
  }, [initPluginSetupParams, plugins]);

  const validateAndAddPlugin = useCallback(async (url: string): Promise<boolean> => {
    const plugin: Plugin = plugins.find((p) => p.url === url) ||
      {
        url,
        name: '',
        description: '',
      };

    return !!(await initPlugin(initPluginSetupParams, plugin));
  }, [initPluginSetupParams, plugins]);


  const runWithImage = useCallback(async (url: string, imageHash: string): Promise<void> => {
    const pluginImage: PluginImageData = getCollectImageData(images, palettes, frames)(imageHash);
    (await getInstance(url))?.withImage(pluginImage);
    sendEvent('runPlugin', { imageCount: 1 });
  }, [getInstance, images, palettes, frames, sendEvent]);

  const runWithImages = useCallback(async (url: string, imageSelection: string[]): Promise<void> => {
    const pluginImages: PluginImageData[] = imageSelection.map(getCollectImageData(images, palettes, frames));
    if (!pluginImages.length) { return; }
    (await getInstance(url))?.withSelection(pluginImages);
    sendEvent('runPlugin', { imageCount: nextPowerOfTwo(pluginImages.length) });
  }, [getInstance, images, palettes, frames, sendEvent]);

  return {
    validateAndAddPlugin,
    runWithImage,
    runWithImages,
  };
};
