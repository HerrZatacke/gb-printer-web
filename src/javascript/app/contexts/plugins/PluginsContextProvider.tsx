import React, { useCallback, useMemo } from 'react';
import type { PropsWithChildren } from 'react';
import { pluginsContext } from './index';
import useItemsStore from '../../stores/itemsStore';
import useInteractionsStore from '../../stores/interactionsStore';
import { useStores } from '../../../hooks/useStores';
import { getCollectImageData } from './functions/collectImageData';
import { initPlugin } from './functions/initPlugin';
import type { InitPluginSetupParams } from './functions/initPlugin';
import type { PluginsContext } from './index';
import type { Plugin, PluginClassInstance, PluginImageData } from '../../../../types/Plugin';
import { useImportExportSettings } from '../../../hooks/useImportExportSettings';

function PluginsContextProvider({ children }: PropsWithChildren) {
  const { plugins, images, addUpdatePluginProperties } = useItemsStore();
  const stores = useStores();
  const { setProgress } = useInteractionsStore();
  const { jsonImport } = useImportExportSettings();

  const initPluginSetupParams = useMemo<InitPluginSetupParams>(() => ({
    collectImageData: getCollectImageData(images),
    addUpdatePluginProperties,
    setProgress,
    stores,
    importFn: jsonImport,
  }), [images, addUpdatePluginProperties, setProgress, stores, jsonImport]);

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

export default PluginsContextProvider;

