import React, { useCallback, useMemo } from 'react';
import { useSelector, useStore } from 'react-redux';
import type { PropsWithChildren } from 'react';
import { pluginsContext } from './index';
import useItemsStore from '../../stores/itemsStore';
import useInteractionsStore from '../../stores/interactionsStore';
import { getCollectImageData } from './functions/collectImageData';
import { initPlugin } from './functions/initPlugin';
import type { InitPluginSetupParams } from './functions/initPlugin';
import type { PluginsContext } from './index';
import type { State, TypedStore } from '../../store/State';
import type { Plugin, PluginClassInstance } from '../../../../types/Plugin';

function PluginsContextProvider({ children }: PropsWithChildren) {
  const images = useSelector((state: State) => state.images);
  const { plugins, addUpdatePluginProperties } = useItemsStore();
  const { setProgress } = useInteractionsStore();
  const store: TypedStore = useStore();

  const initPluginSetupParams = useMemo<InitPluginSetupParams>(() => ({
    collectImageData: getCollectImageData(images),
    addUpdatePluginProperties,
    setProgress,
    store,
  }), [store, images, setProgress, addUpdatePluginProperties]);

  const getInstance = useMemo(() => async (url: string): Promise<PluginClassInstance | null> => {
    const plugin: Plugin = plugins.find((p) => p.url === url) || { url: '' };
    return initPlugin(initPluginSetupParams, plugin);
  }, [initPluginSetupParams, plugins]);

  const validateAndAddPlugin = useCallback(async (plugin: Plugin): Promise<boolean> => (
    !!(await initPlugin(initPluginSetupParams, plugin))
  ), [initPluginSetupParams]);


  const contextValue = useMemo<PluginsContext>(() => ({
    runWithImage: async (url: string, imageHash: string): Promise<void> => {
      (await getInstance(url))?.withImage(getCollectImageData(images)(imageHash));
    },
    runWithImages: async (url: string, imageSelection: string[]): Promise<void> => {
      (await getInstance(url))?.withSelection(imageSelection.map(getCollectImageData(images)));
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

