import type { Plugin } from '../../../../../../types/Plugin';
import useItemsStore from '../../../../stores/itemsStore';

interface UsePlugins {
  plugins: Plugin[];
  pluginAdd: (url: string) => void,
  pluginRemove: (url: string) => void,
  pluginUpdateConfig: (url: string, key: string, value: string | number) => void,
}

export const usePlugins = (): UsePlugins => {
  const { plugins, addPlugins, deletePlugin, updatePluginConfig } = useItemsStore();

  const pluginAdd = (url: string) => addPlugins([{ url }]);

  const pluginRemove = (url: string) => deletePlugin(url);

  const pluginUpdateConfig = (url: string, key: string, value: string | number) => {
    updatePluginConfig({ url, config: { [key]: value } });
  };

  return {
    plugins,
    pluginAdd,
    pluginRemove,
    pluginUpdateConfig,
  };
};
