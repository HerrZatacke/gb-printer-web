import { useCallback, useEffect, useState } from 'react';
import useGIS from '@/contexts/GisContext';
import { useItemsStore, useStoragesStore } from '@/stores/stores';
import Sheet = gapi.client.sheets.Sheet;
import SheetProperties = gapi.client.sheets.SheetProperties;
import DeveloperMetadata = gapi.client.sheets.DeveloperMetadata;

export interface SheetState {
  properties: SheetProperties;
  lastUpdate: number;
}

export interface GapiSyncContextType {
  busy: boolean;
  sheets: SheetState[];
}

const getLastUpdate = (developerMetadata: DeveloperMetadata[]): number => (
  developerMetadata.reduce((max, item) => {
    if (item.metadataKey !== 'lastUpdate') return max;
    const value = Number(item.metadataValue);
    return value > max ? value : max;
  }, 0)
);

const getSheetState = (sheet: Sheet): SheetState | null => {
  const properties = sheet.properties;

  if (!properties) {
    return null;
  }

  return {
    properties,
    lastUpdate: getLastUpdate(sheet.developerMetadata || []),
  };
};

export const useContextHook = (): GapiSyncContextType => {
  const { gapiStorage } = useStoragesStore();
  const { palettes } = useItemsStore();
  const { isReady } = useGIS();
  const [busy, setBusy] = useState(false);
  const [sheets, setSheets] = useState<SheetState[]>([]);
  const [gapiClient, setGapiClient] = useState<typeof gapi.client | null>(null);

  const initClient = useCallback(async () => {
    if (!isReady || !gapiStorage.use) {
      setGapiClient(null);
      return;
    }

    if (gapiClient) {
      return;
    }

    gapi.load('client', async () => {
      await gapi.client.init({
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
      });

      setGapiClient(gapi.client);
    });
  }, [gapiClient, gapiStorage.use, isReady]);

  const applyToken = useCallback(() => {
    const { use, token } = gapiStorage;

    if (
      !isReady ||
      !gapiClient ||
      gapiClient.getToken()?.access_token === token
    ) {
      return;
    }

    if (!use || !token ) {
      gapiClient?.setToken(null);
      return;
    }

    console.log('🤖 applyToken: setting new token');
    gapiClient.setToken({ access_token: token });
  }, [gapiClient, gapiStorage, isReady]);

  const updateSheets = useCallback(async () => {
    const sheetsClient = gapiClient?.sheets;
    const { use, sheetId } = gapiStorage;

    if (!sheetsClient || !sheetId || !use) {
      return;
    }

    setBusy(true);

    const { result: { sheets: remoteSheets } } = await sheetsClient.spreadsheets.get({
      spreadsheetId: sheetId,
    });

    const sheetStates = (remoteSheets || []).map(getSheetState).filter(Boolean) as SheetState[];

    setSheets(sheetStates);
    setBusy(false);
  }, [gapiClient, gapiStorage]);

  useEffect(() => { initClient(); }, [gapiStorage, initClient]);

  useEffect(() => { applyToken(); }, [applyToken]);

  // start polling
  useEffect(() => {
    const pollHandle = setInterval(updateSheets, 60000);
    const instantHandle = setTimeout(updateSheets, 1);

    return () => {
      clearInterval(pollHandle);
      clearTimeout(instantHandle);
    };
  }, [updateSheets]);

  return {
    busy,
    sheets,
  };
};
