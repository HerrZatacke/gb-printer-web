import { saveAs } from 'file-saver';
import { InitPluginSetupParams, Plugin, PluginClassInstance } from '@/types/Plugin';
import { pluginFunctions, pluginCompatibilityStore } from './pluginContextFunctions';

export const initPlugin = (
  {
    startProgress,
    setProgress,
    stopProgress,
    addUpdatePluginProperties,
    collectImageData,
    stores,
    importFn,
  }: InitPluginSetupParams,
  plugin: Plugin,
): Promise<PluginClassInstance | null> => {
  const { url, config: initialConfig = {} } = plugin;

  let progressId = '';

  const progress = (progressValue: number): void => {
    const value = Math.min(1, Math.max(0, progressValue));

    if (progressId && (value === 0 || value === 1)) {
      stopProgress(progressId);
      progressId = '';
      return;
    }

    if (!progressId) {
      progressId = startProgress(plugin.name || 'Plugin');
    }

    setProgress(progressId, value);
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
          store: pluginCompatibilityStore(stores, importFn),
          functions: pluginFunctions(stores, importFn),
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
