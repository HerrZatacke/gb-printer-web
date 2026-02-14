import { useEffect, useCallback, useState, useMemo } from 'react';
import { useLoadScript } from '@/hooks/useLoadScript';
import { useStoragesStore } from '@/stores/stores';
import TokenClient = google.accounts.oauth2.TokenClient;

export interface GISContextType {
  isSignedIn: boolean;
  isReady: boolean;
  handleSignIn: () => Promise<void>;
  handleSignOut: () => Promise<void>;
}

const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID || '';
const scope = process.env.NEXT_PUBLIC_GOOGLE_SCOPE || '';

export const useContextHook = (): GISContextType => {
  const { loadScript } = useLoadScript();
  const { setGapiSettings, gapiStorage } = useStoragesStore();
  const [tokenClient, setTokenClient] = useState<TokenClient | null>(null);

  const isSignedIn = useMemo(() => (
    Boolean(gapiStorage.token)
  ), [gapiStorage.token]);

  const isReady = useMemo(() => (
    Boolean(tokenClient)
  ), [tokenClient]);

  const createTokenClient = useCallback(() => {
    if (!clientId || !scope) {
      return;
    }

    setTokenClient((currentTokenClient) => {
      if (currentTokenClient) {
        return currentTokenClient;
      }

      return google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope,
        callback: (tokenResponse) => {
          console.log('🤖 callback');
          if (tokenResponse.error) {
            throw new Error(tokenResponse.error_description);
          }

          setGapiSettings({
            token: tokenResponse.access_token,
            tokenExpiry: Date.now() + (parseInt(tokenResponse.expires_in || '0', 10) * 1000),
          });
        },
      });
    });
  }, [setGapiSettings]);

  useEffect(() => {
    const { use, tokenExpiry, token } = gapiStorage;
    if (!clientId || !use || !token) {
      return;
    }

    const tokenExpiresInMs = (tokenExpiry || 0) - Date.now();

    const tokenExpiryTimerHandle = window.setTimeout(() => {
      if (tokenClient) {
        tokenClient.requestAccessToken({ prompt: '' });
      }
    }, tokenExpiresInMs);

    return () => window.clearTimeout(tokenExpiryTimerHandle);
  }, [gapiStorage, setGapiSettings, tokenClient]);

  useEffect(() => {
    if (!clientId || !gapiStorage.use) {
      return;
    }

    const handle = setTimeout(async () => {
      await loadScript('https://accounts.google.com/gsi/client');
      await loadScript('https://apis.google.com/js/api.js');
      await createTokenClient();
    }, 1);

    return () => clearTimeout(handle);
  }, [gapiStorage.use, createTokenClient, loadScript]);

  const handleSignIn = useCallback(async () => {
    if (!tokenClient) {
      console.log('no tokenClient');
      return;
    }

    tokenClient.requestAccessToken({ prompt: '' });
  }, [tokenClient]);

  const handleSignOut = useCallback(async () => {
    if (!gapiStorage.token) {
      return;
    }

    google.accounts.oauth2.revoke(gapiStorage?.token, () => {
      setGapiSettings({
        token: '',
        tokenExpiry: 0,
      });
    });
  }, [gapiStorage.token, setGapiSettings]);

  return { handleSignIn, handleSignOut, isSignedIn, isReady };
};
