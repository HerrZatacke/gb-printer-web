import { hash as ohash } from 'ohash';
import type { StoreApi } from 'zustand';
import { ItemsState } from '@/stores/itemsStore';
import { StoragesState } from '@/stores/storagesStore';
import { GapiSettings } from '@/types/Sync';
// import { objectsToSheet } from '@/tools/sheetConversion/objectsToSheet';
// import { sheetToObjects } from '@/tools/sheetConversion/sheetToObjects';
// import { Image } from '@/types/Image';

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
      if (use && sheetId /* && confirm('pull images?') */) {
        // const importStart = Date.now();
        // const { result } = await gapi.client.sheets.spreadsheets.values.get({
        //   spreadsheetId: sheetId,
        //   range: 'images!A1:Z10000',
        // });
        //
        // const imagesToImport = sheetToObjects<Image>(result.values as string[][], 'hash');
        // itemsStore.getState().setImages(imagesToImport);
        // console.log(`Image import done in ${Date.now() - importStart}ms`);
      }
    }, 15000);
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
      itemsDebounceHandle = window.setTimeout(async () => {
        console.log('🤖 itemsState has changed!');
        const { use, sheetId } = gapiStorageConfig;

        if (!use || !sheetId || !gapi.client) {
          return;
        }

        // const palStart = Date.now();
        //
        // const { result: palettesResult } = await gapi.client.sheets.spreadsheets.values.get({
        //   spreadsheetId: sheetId,
        //   range: 'palettes!A1:Z10000',
        // });
        //
        // const updateSheetDataPalettes = objectsToSheet(itemsState.palettes.filter(({ isPredefined }) => !isPredefined), {
        //   deleteMissing: false,
        //   existing: palettesResult.values,
        //   key: 'shortName',
        // });
        //
        // await gapi.client.sheets.spreadsheets.values.update({
        //   spreadsheetId: sheetId,
        //   range: 'palettes!A1',
        //   valueInputOption: 'USER_ENTERED',
        //   resource: { values: updateSheetDataPalettes },
        // });
        //
        // console.log(`Palettes in ${Date.now() - palStart}ms`);
        //
        //
        //
        // const imgStart = Date.now();
        //
        // const { result: imagesResult } = await gapi.client.sheets.spreadsheets.values.get({
        //   spreadsheetId: sheetId,
        //   range: 'images!A1:Z10000',
        // });
        //
        // const updateSheetDataImages = objectsToSheet(itemsState.images, {
        //   deleteMissing: false,
        //   existing: imagesResult.values,
        //   key: 'hash',
        // });
        //
        // await gapi.client.sheets.spreadsheets.values.update({
        //   spreadsheetId: sheetId,
        //   range: 'images!A1',
        //   valueInputOption: 'USER_ENTERED',
        //   resource: { values: updateSheetDataImages },
        // });
        //
        // console.log(`Images in ${Date.now() - imgStart}ms`);



        // console.log('🤖 Data saved!');
      }, 5000);
    }
  });

  return () => {
    unsubscribeConfig();
    unsubscribeItems();
  };
};
