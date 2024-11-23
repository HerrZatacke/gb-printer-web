import { saveAs } from 'file-saver';
import type { Plugin, PluginClassInstance } from '../../../../../types/Plugin';
import type { ItemsState } from '../../../stores/itemsStore';
import type { InteractionsState } from '../../../stores/interactionsStore';
import type { CollectImageDataFn } from './collectImageData';
import type { TypedStore } from '../../../store/State';
import { pluginCompatibilityStore } from './pluginContextFunctions';

export type InitPluginSetupParams =
  Pick<ItemsState, 'addUpdatePluginProperties'> &
  Pick<InteractionsState, 'setProgress'> &
  {
    collectImageData: CollectImageDataFn,
    store: TypedStore,
  }


export const initPlugin = (
  {
    setProgress,
    addUpdatePluginProperties,
    collectImageData,
    store,
  }: InitPluginSetupParams,
  plugin: Plugin,
): Promise<PluginClassInstance | null> => {
  const { url, config: initialConfig = {} } = plugin;

  const progress = (progressValue: number): void => {
    setProgress('plugin', progressValue % 1);
  };

  return new Promise((resolve) => {
    window.gbpwRegisterPlugin = (PluginClass) => {
      window.gbpwRegisterPlugin = () => { /* noop */ };

      if (!PluginClass) {
        resolve(null);
        return;
      }

      try {
        const instance: PluginClassInstance = new PluginClass({
          saveAs,
          progress,
          store: pluginCompatibilityStore(store),
          collectImageData,
        }, initialConfig);

        const {
          name,
          description = '',
          configParams = {},
          config = {},
        } = instance;

        addUpdatePluginProperties({
          url,
          name,
          description,
          configParams,
          config,
          loading: false,
          error: false,
        });

        resolve(instance);
      } catch (error: unknown) {
        addUpdatePluginProperties({
          url,
          loading: false,
          error: (error as Error)?.message,
        });

        resolve(null);
      }
    };

    // init loading of external script.
    const pluginScript = document.createElement('script');
    document.head.appendChild(pluginScript);

    pluginScript.addEventListener('error', () => {
      window.gbpwRegisterPlugin = () => { /* noop */ };

      addUpdatePluginProperties({
        url,
        loading: false,
        error: 'Loading error',
      });

      resolve(null);
    });

    pluginScript.src = url;
  });
};
