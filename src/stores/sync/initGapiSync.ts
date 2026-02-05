import { hash as ohash } from 'ohash';
import type { StoreApi } from 'zustand';
import { ItemsState } from '@/stores/itemsStore';
import { StoragesState } from '@/stores/storagesStore';
import { GapiSettings } from '@/types/Sync';

type FnTeardown = () => void;

export const initGapiSync = (
  storagesStore: StoreApi<StoragesState>,
  itemsStore: StoreApi<ItemsState>,
): FnTeardown => {
  if (typeof window === 'undefined') {
    return () => { /**/ };
  }

  let gapiInitialized = false;
  let gapiStorageConfig: GapiSettings = storagesStore.getState().gapiStorage;
  let itemsState: ItemsState = itemsStore.getState();

  const applyToken = (): boolean => {
    const { use, token } = gapiStorageConfig;

    if (!use || !token) {
      return false;
    }

    if (gapi.client.getToken()?.access_token === token) {
      return true;
    }

    gapi.client.setToken({
      access_token: token,
      // expires_in: // ToDo
    });
    return true;
  };

  const initClient = async (): Promise<boolean> => (
    new Promise((resolve) => {
      if (typeof window.gapi === 'undefined') {
        resolve(false);
        return;
      }

      if (!gapiInitialized) {
        gapi.load('client', async () => {
          await gapi.client.init({
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
          });
          gapiInitialized = true;
          resolve(applyToken());
        });
      } else {
        resolve(applyToken());
      }
    })
  );


  let testHandle: number;
  let testStarted = false;
  const testCall = () => {
    if (testStarted) {
      return;
    }

    console.log('🤖 start polling');
    testStarted = true;

    clearInterval(testHandle);
    testHandle = window.setInterval(async () => {
      const { use, sheetId } = gapiStorageConfig;
      if (use && sheetId) {
        const { result } = await gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: sheetId,
          range: 'images!A1',
        });
        console.info(JSON.stringify(result.values));
      }
    }, 5 * 60000);
  };

  // wait fpr possible initially loaded client
  window.setTimeout(async () => {
    const initialized = await initClient();
    if (initialized) {
      testCall();
    }
  }, 4000);


  const unsubscribeConfig = storagesStore.subscribe(async (state) => {
    if (ohash(state.gapiStorage) !== ohash(gapiStorageConfig)) {
      console.log('🤖 gapiStorageConfig has changed!');
      gapiStorageConfig = state.gapiStorage;

      const initialized = await initClient();
      if (initialized) {
        testCall();
      }
    }
  });


  let itemsDebounceHandle: number;
  const unsubscribeItems = itemsStore.subscribe((state) => {
    if (state !== itemsState) {
      itemsState = state;
      window.clearTimeout(itemsDebounceHandle);
      itemsDebounceHandle = window.setTimeout(() => {
        console.log('🤖 itemsState has changed!');
      }, 10);
    }
  });

  return () => {
    unsubscribeConfig();
    unsubscribeItems();
  };
};
