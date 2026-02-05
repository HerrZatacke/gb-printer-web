import { useEffect, useCallback, useState, useMemo } from 'react';
import { useLoadScript } from '@/hooks/useLoadScript';
import { useStoragesStore } from '@/stores/stores';
import TokenClient = google.accounts.oauth2.TokenClient;

interface UseGIS {
  isSignedIn: boolean;
  handleSignIn: () => Promise<void>;
  handleSignOut: () => Promise<void>;
}

export const useGIS = (): UseGIS => {
  const { loadScript } = useLoadScript();
  const { setGapiSettings, gapiStorage } = useStoragesStore();
  const [tokenClient, setTokenClient] = useState<TokenClient | null>(null);

  // ToDo: Find place to remove accessTokenData once expired
  // useEffect(() => {
  //   if (!accessTokenData) {
  //     return;
  //   }
  //
  //   const expiresInMs = Math.max(1, (accessTokenData?.expiry || 0) - Date.now());
  //   // console.log(`expires in ${new Date(expiresInMs).toLocaleTimeString('en-GB', {
  //   //   hour: '2-digit',
  //   //   minute: '2-digit',
  //   //   second: '2-digit',
  //   //   hour12: false,
  //   //   timeZone: 'UTC',
  //   // })}`);
  //
  //   const expiryHandle = setTimeout(() => {
  //     setAccessTokenData(null);
  //   }, expiresInMs);
  //
  //   return () => clearTimeout(expiryHandle);
  // }, [accessTokenData, setAccessTokenData]);

  const isSignedIn = useMemo(() => (
    Boolean(gapiStorage.token)
  ), [gapiStorage.token]);

  const createTokenClient = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID || '';
    const scope = process.env.NEXT_PUBLIC_GOOGLE_SCOPE || '';

    if (!clientId || !scope) {
      console.log({ clientId, scope });
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
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID || '';
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


  return {
    handleSignIn,
    handleSignOut,
    isSignedIn,
  };
};
