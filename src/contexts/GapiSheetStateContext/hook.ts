import { hash as ohash } from 'ohash';
import { useCallback, useEffect, useState } from 'react';
import {
  type GapiLastUpdates,
  sheetNames,
} from '@/contexts/GapiSheetStateContext/consts';
import { createGapiLastUpdates } from '@/contexts/GapiSheetStateContext/tools/createGapiLastUpdates';
import useGIS from '@/contexts/GisContext';
import { useStoragesStore } from '@/stores/stores';
import Sheet = gapi.client.sheets.Sheet;

export interface GapiSheetStateContextType {
  busy: boolean;
  sheets: Sheet[];
  gapiClient: typeof gapi.client | null;
  gapiLastRemoteUpdates: GapiLastUpdates | null;
  updateSheets: () => Promise<void>;
}

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
    gapiClient,
    sheets,
    gapiLastRemoteUpdates,
    updateSheets,
  };
};
