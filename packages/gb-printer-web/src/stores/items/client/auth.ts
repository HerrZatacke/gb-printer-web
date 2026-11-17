import { jwtDecode } from 'jwt-decode';
import { $fetch } from 'ofetch';
import { cleanDoubleSlashes } from 'ufo';
import { useInteractionsStore } from '@/stores/stores';
import { Date } from '@/tools/safeDate';

// refresh token 10s before it actually expires
const TOKEN_EXPIRY_BUFFERTIME = 10000;

const setRemoteStorageStatus = useInteractionsStore.getState().setRemoteStorageStatus;

export default class ApiAuth {
  private authEnabledPromise: Promise<boolean>;
  private authTokenPromise: Promise<string> | undefined;
  private refreshTimeout: number = NaN;

  constructor(
    private readonly remoteStorageUrl: string,
  ) {
    if (!remoteStorageUrl) {
      this.authEnabledPromise = Promise.resolve(false);
    } else {
      this.authEnabledPromise = $fetch<{ authEnabled: boolean }>(cleanDoubleSlashes(`${this.remoteStorageUrl}/auth/status`))
        .then(({ authEnabled }) => authEnabled);
    }
  }

  private async initializeAuth(): Promise<string> {

    const authEnabled = await this.authEnabledPromise;

    if (!authEnabled) {
      // skip popup, skip refresh, skip attaching Authorization header entirely
      return '';
    }

    const storedToken = sessionStorage.getItem('authToken');
    if (storedToken) {
      const { exp } = jwtDecode<{ exp: number }>(storedToken);
      const untilExpired = (exp * 1000) - Date.now();
      if (untilExpired > 0) {
        this.setRefreshTimeout(storedToken);
        return Promise.resolve(storedToken);
      }
    }

    console.log('No valid stored token - need to obtain a fresh token via the login popup');
    const expectedOrigin = new URL(this.remoteStorageUrl).origin;

    if (expectedOrigin === window.origin) {
      return this.getRefreshToken();
    }

    setRemoteStorageStatus('awaitingToken');

    const popup = window.open(
      `${cleanDoubleSlashes(`${this.remoteStorageUrl}/auth/token`)}?origin=${encodeURIComponent(window.location.origin)}`,
      'auth-token-popup',
      'width=420,height=780',
    );

    if (!popup) {
      setRemoteStorageStatus('popupBlocked');
      return await new Promise((resolve) => {
        console.log('Awaiting resolve.');
        const unsubscribe = useInteractionsStore.subscribe(async ({ remoteStorageStatus }) => {
          if (remoteStorageStatus === null) {
            console.log('retry now');
            const retryResult = await this.getBearerToken(true);
            if (retryResult) {
              unsubscribe();
              setRemoteStorageStatus('');
              resolve(retryResult);
            }
          }
        });
      });
    }

    return new Promise((resolve) => {
      const handleMessage = (event: MessageEvent): void => {
        if (event.origin !== expectedOrigin) {
          return;
        }

        window.removeEventListener('message', handleMessage);
        clearInterval(popupClosedCheck);

        const { token } = event.data as { token?: string };

        if (!token) {
          setRemoteStorageStatus('popupNoToken');
          console.log('Awaiting resolve.');
          const unsubscribe = useInteractionsStore.subscribe(async ({ remoteStorageStatus }) => {
            if (remoteStorageStatus === null) {
              console.log('retry now');
              const retryResult = await this.getBearerToken(true);
              if (retryResult) {
                unsubscribe();
                setRemoteStorageStatus('');
                resolve(retryResult);
              }
            }
          });
          return;
        }

        sessionStorage.setItem('authToken', token);
        setRemoteStorageStatus('');
        this.setRefreshTimeout(token);
        resolve(token);
      };

      const popupClosedCheck = setInterval(() => {
        if (popup.closed) {
          clearInterval(popupClosedCheck);
          window.removeEventListener('message', handleMessage);
          setRemoteStorageStatus('popupClosedEarly');
          console.log('Awaiting resolve.');
          const unsubscribe = useInteractionsStore.subscribe(async ({ remoteStorageStatus }) => {
            if (remoteStorageStatus === null) {
              console.log('retry now');
              const retryResult = await this.getBearerToken(true);
              if (retryResult) {
                unsubscribe();
                setRemoteStorageStatus('');
                resolve(retryResult);
              }
            }
          });
          return;
        }
      }, 500);

      window.addEventListener('message', handleMessage);
    });
  }

  private async getRefreshToken(): Promise<string> {
    const sameOrigin =  new URL(this.remoteStorageUrl).origin === window.origin;
    console.log('Refreshing token now');
    const authToken = !sameOrigin ? await this.authTokenPromise : '';
    console.log('Refreshing token now with ', { authToken });
    const refresh = await $fetch<{ token: string }>(cleanDoubleSlashes(`${this.remoteStorageUrl}/auth/token/refresh`), {
      method: 'GET',
      headers: {
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
    });

    sessionStorage.setItem('authToken', refresh.token);
    this.setRefreshTimeout(refresh.token);
    this.authTokenPromise = Promise.resolve(refresh.token);

    return await this.authTokenPromise;
  }

  private setRefreshTimeout(token: string) {
    window.clearTimeout(this.refreshTimeout);

    const { exp } = jwtDecode<{ exp: number }>(token);
    const untilExpired = (exp * 1000) - Date.now();

    console.log(`Refreshing token @ ${new Date(Date.now() + untilExpired - TOKEN_EXPIRY_BUFFERTIME)}`);
    this.refreshTimeout = window.setTimeout(this.getRefreshToken.bind(this), Math.max(0, untilExpired - TOKEN_EXPIRY_BUFFERTIME));
  }

  public getBearerToken(force: boolean): Promise<string> {
    if (force) {
      sessionStorage.removeItem('authToken');
      this.authTokenPromise = undefined;
    }

    if (!this.authTokenPromise) {
      this.authTokenPromise = this.initializeAuth();
    }

    return this.authTokenPromise;
  }
}

