import { useCallback, useState } from 'react';
import { parseURL } from 'ufo';
import { useParams, useNavigate } from 'react-router';
import useItemsStore from '../app/stores/itemsStore';
import { usePluginsContext } from '../app/contexts/plugins';
import useInteractionsStore from '../app/stores/interactionsStore';

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
  pending: boolean,
  addPlugin: () => Promise<void>,
}
export const useAddPlugin = (): UseAddPlugin => {
  const url = useParams().pluginUrl || '';
  const [pending, setPending] = useState(false);
  const parsedPluginUrl = parseURL(url);
  const { plugins } = useItemsStore();
  const { setError } = useInteractionsStore();
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

  const addPlugin = useCallback(async () => {
    setPending(true);
    navigate('/settings/plugins', { replace: true });
    const installSuccess = await validateAndAddPlugin({ url });
    if (!installSuccess) {
      setError(new Error('Could not install plugin.'));
    }
  }, [navigate, setError, url, validateAndAddPlugin]);

  return {
    url,
    pending,
    pluginExists,
    source: `${parsedPluginUrl.protocol}//${parsedPluginUrl.host}`,
    isTrusted,
    addPlugin,
  };
};
