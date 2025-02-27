import { parseURL } from 'ufo';
import { useParams, useNavigate } from 'react-router';
import useItemsStore from '../../stores/itemsStore';
import { usePluginsContext } from '../../contexts/plugins';

const trustedSources = [
  'https://herrzatacke.github.io',
  'https://localhost:5000',
  'https://127.0.01:5000',
  'http://localhost:5000',
  'http://127.0.01:5000',
];

interface UseAddPlugin {
  url: string,
  source: string,
  pluginExists: boolean,
  isTrusted: boolean,
  canAdd: boolean,
  addPlugin: () => Promise<void>,
}
export const useAddPlugin = (): UseAddPlugin => {
  const url = useParams().pluginUrl || '';
  const parsedPluginUrl = parseURL(url);
  const { plugins } = useItemsStore();
  const { validateAndAddPlugin } = usePluginsContext();
  const navigate = useNavigate();

  const isTrusted = trustedSources.some((source) => {
    const parsedSourceUrl = parseURL(source);
    return (
      parsedSourceUrl.protocol === parsedPluginUrl.protocol &&
      parsedSourceUrl.host === parsedPluginUrl.host
    );
  });

  const pluginExists = plugins.some((plugin) => (
    plugin.url === url
  ));

  const addPlugin = async () => {
    await validateAndAddPlugin({ url });
    navigate('/settings/plugins', { replace: true });
  };

  return {
    url,
    pluginExists,
    source: `${parsedPluginUrl.protocol}//${parsedPluginUrl.host}`,
    isTrusted,
    canAdd: !pluginExists,
    addPlugin,
  };
};
