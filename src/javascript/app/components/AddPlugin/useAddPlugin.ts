import { parseURL } from 'ufo';
import { useParams, useNavigate } from 'react-router-dom';
import useItemsStore from '../../stores/itemsStore';
import { usePlugins } from '../Settings/pages/PluginSettings/usePlugins';

const trustedSources = [
  'https://herrzatacke.github.io',
  'https://localhost:5000',
  'https://127.0.01:5000',
  'http://localhost:5000',
  'http://127.0.01:5000',
];

interface UseAddPlugin {
  pluginUrl: string,
  source: string,
  pluginExists: boolean,
  isTrusted: boolean,
  canAdd: boolean,
  addPlugin: () => void,
}
export const useAddPlugin = (): UseAddPlugin => {
  const pluginUrl = useParams().pluginUrl || '';
  const parsedPluginUrl = parseURL(pluginUrl);
  const { plugins } = useItemsStore();
  const navigate = useNavigate();
  const { pluginAdd } = usePlugins();

  const isTrusted = trustedSources.some((source) => {
    const parsedSourceUrl = parseURL(source);
    return (
      parsedSourceUrl.protocol === parsedPluginUrl.protocol &&
      parsedSourceUrl.host === parsedPluginUrl.host
    );
  });

  const pluginExists = plugins.some((plugin) => (
    plugin.url === pluginUrl
  ));

  const addPlugin = () => {
    pluginAdd(pluginUrl);
    navigate('/settings/plugins', { replace: true });
  };

  return {
    pluginUrl,
    pluginExists,
    source: `${parsedPluginUrl.protocol}//${parsedPluginUrl.host}`,
    isTrusted,
    canAdd: !pluginExists,
    addPlugin,
  };
};
