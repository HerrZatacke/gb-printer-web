import type { StoreApi } from 'zustand';
import { ItemsState } from '@/stores/itemsStore';
import { StoragesState } from '@/stores/storagesStore';
import { GapiSettings } from '@/types/Sync';

type FnTeardown = () => void;

export const initGapiSync = (
  storagesStore: StoreApi<StoragesState>,
  itemsStore: StoreApi<ItemsState>,
): FnTeardown => {

  let gapiConfig: GapiSettings = storagesStore.getState().gapiStorage;
  let gapiClient: typeof gapi.client | null = null;

  const unsubscribeConfig = storagesStore.subscribe((state) => {
    if (state.gapiStorage !== gapiConfig) {
      gapiConfig = state.gapiStorage;

      const { use, sheetId } = gapiConfig;

      if (!use || !sheetId) {
        gapiClient = null;
        return;
      }

      gapi.load('client', async () => {
        await gapi.client.init({
          discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        });

        gapiClient = gapi.client;

        const resp = await gapiClient.sheets.spreadsheets.values.get({
          spreadsheetId: sheetId,
          range: 'images!A1',
        });

        const values = resp.result.values;
        console.info(values);
      });
    }
  });


  let itemsState: ItemsState = itemsStore.getState();

  const unsubscribeItems = itemsStore.subscribe(
    (state) => {
      if (state !== itemsState) {
        console.log('itemsState has changed!');
        itemsState = state;
      }
    },
  );

  return () => {
    unsubscribeConfig();
    unsubscribeItems();
  };
};
