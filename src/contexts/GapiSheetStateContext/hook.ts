import { hash as ohash } from 'ohash';
import { useCallback, useEffect, useState } from 'react';
import {
  type GapiLastUpdates,
  LASTUPDATE_METADATA_KEY,
  SheetName,
  sheetNames,
} from '@/contexts/GapiSheetStateContext/consts';
import useGIS from '@/contexts/GisContext';
import { useStoragesStore } from '@/stores/stores';
import Sheet = gapi.client.sheets.Sheet;
import DeveloperMetadata = gapi.client.sheets.DeveloperMetadata;

export interface GapiSheetStateContextType {
  busy: boolean;
  sheets: Sheet[];
  gapiLastRemoteUpdates: GapiLastUpdates | null;
}

const getSheetByTitle = (sheets: Sheet[]) => (title: SheetName): Sheet | null => (
  sheets.find(({ properties }) => (properties?.title === title)) || null
);

const getLastUpdate = (developerMetadata: DeveloperMetadata[]): number => (
  developerMetadata.reduce((max, item) => {
    if (item.metadataKey !== LASTUPDATE_METADATA_KEY) {
      return max;
    }

    const value = Number(item.metadataValue);
    return value > max ? value : max;
  }, 0)
);

const createGapiLastUpdates = (sheets: Sheet[]): GapiLastUpdates => {
  const getByTitle = getSheetByTitle(sheets);
  const lastUpdates: Partial<GapiLastUpdates> = {};

  for (const name of sheetNames) {
    lastUpdates[name] = getLastUpdate(getByTitle(name)?.developerMetadata || []);
  }

  return lastUpdates as GapiLastUpdates;
};

export const useContextHook = (): GapiSheetStateContextType => {
  const { gapiStorage } = useStoragesStore();
  const { isReady } = useGIS();
  const [busy, setBusy] = useState(false);
  const [gapiClient, setGapiClient] = useState<typeof gapi.client | null>(null);
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [gapiLastRemoteUpdates, setGapiLastRemoteUpdates] = useState<GapiLastUpdates | null>(null);

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

    const newLastRemoteUpdates = createGapiLastUpdates(remoteSheets || []);
    const sheetStates = (remoteSheets || []).filter(({ properties }) => {
      if (!properties?.title) {
        return false;
      }

      return (sheetNames as string[]).includes(properties.title);
    });


    setGapiLastRemoteUpdates((currentLastRemoteUpdates) => {
      // only trigger a settings update if the timestamps have changed
      if (ohash(newLastRemoteUpdates) === ohash(currentLastRemoteUpdates)) {
        return currentLastRemoteUpdates;
      }
      return newLastRemoteUpdates;
    });

    setSheets(sheetStates);
    setBusy(false);
  }, [gapiClient, gapiStorage]);

  useEffect(() => { initClient(); }, [gapiStorage, initClient]);

  useEffect(() => { applyToken(); }, [applyToken]);

  // start polling
  useEffect(() => {
    if (!isReady) {
      return;
    }

    const pollHandle = setInterval(updateSheets, 60000);
    const instantHandle = setTimeout(updateSheets, 1);

    return () => {
      clearInterval(pollHandle);
      clearTimeout(instantHandle);
    };
  }, [isReady, updateSheets]);

  return {
    busy,
    sheets,
    gapiLastRemoteUpdates,
  };
};
