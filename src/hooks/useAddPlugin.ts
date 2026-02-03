import { redirect, RedirectType } from 'next/navigation';
import { useCallback, useState } from 'react';
import { parseURL } from 'ufo';
import { usePluginsContext } from '@/contexts/plugins';
import { useUrl } from '@/hooks/useUrl';
import { useInteractionsStore, useItemsStore } from '@/stores/stores';

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
  const { searchParams } = useUrl();
  const url = searchParams.get('pluginUrl') ||'';
  const parsedPluginUrl = parseURL(url);
  const [pending, setPending] = useState(false);
  const { plugins } = useItemsStore();
  const { setError } = useInteractionsStore();
  const { validateAndAddPlugin } = usePluginsContext();

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
    const installSuccess = await validateAndAddPlugin({ url });
    if (!installSuccess) {
      setError(new Error('Could not install plugin.'));
    }
    redirect('/settings/plugins', RedirectType.replace);
  }, [setError, url, validateAndAddPlugin]);

  return {
    url,
    pending,
    pluginExists,
    source: `${parsedPluginUrl.protocol}//${parsedPluginUrl.host}`,
    isTrusted,
    addPlugin,
  };
};
