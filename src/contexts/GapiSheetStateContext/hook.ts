import { hash as ohash } from 'ohash';
import Queue from 'promise-queue';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type GapiLastUpdates,
  sheetNames,
} from '@/contexts/GapiSheetStateContext/consts';
import { createGapiLastUpdates } from '@/contexts/GapiSheetStateContext/tools/createGapiLastUpdates';
import useGIS from '@/contexts/GisContext';
import { useStoragesStore } from '@/stores/stores';
import { delay } from '@/tools/delay';
import Sheet = gapi.client.sheets.Sheet;


export interface GapiSheetStateContextType {
  busy: boolean;
  isReady: boolean;
  sheets: Sheet[];
  gapiLastRemoteUpdates: GapiLastUpdates | null;
  updateSheets: () => Promise<void>;
  enqueueSheetsClientRequest: (callback: (sheetsClient: typeof gapi.client.sheets) => Promise<void>) => Promise<void>;
  clearGapiLastRemoteUpdates: () => void;
}

export const useContextHook = (): GapiSheetStateContextType => {
  const { gapiStorage } = useStoragesStore();
  const { isReady } = useGIS();
  const [busy, setBusy] = useState(false);
  const [gapiClient, setGapiClient] = useState<typeof gapi.client | null>(null);
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [gapiLastRemoteUpdates, setGapiLastRemoteUpdates] = useState<GapiLastUpdates | null>(null);
  const refreshHandle = useRef<number>(0);
  const queue = useRef<Queue | null>(null);

  if (!queue.current) {
    queue.current = new Queue(1, Infinity);
  }

  const enqueueSheetsClientRequest = useCallback((callback: (sheetsClient: typeof gapi.client.sheets) => Promise<void>) => {
    const sheetsClient = gapiClient?.sheets;

    if (!queue.current) {
      throw new Error('No queue available');
    }

    if (!sheetsClient) {
      throw new Error('No sheetsClient available');
    }

    return queue.current.add(async () => {
      setBusy(true);
      try {
        await callback(sheetsClient);
      } catch (error) {
        // ToDo: can we read the error reason here? e.g. quota/timeout and wait accordingly
        console.log(error);
        await delay(2000);
      }
      setBusy(false);
    });
  }, [gapiClient?.sheets]);

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
    const { use, sheetId } = gapiStorage;

    if (!sheetId || !use) {
      return;
    }

    console.log('📊 Updating sheet dates');

    window.clearTimeout(refreshHandle.current);

    try {
      await enqueueSheetsClientRequest(async (sheetsClient) => {
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
      });
    } finally {
      refreshHandle.current = window.setTimeout(updateSheets, 60000);
    }
  }, [enqueueSheetsClientRequest, gapiStorage]);

  const clearGapiLastRemoteUpdates = useCallback(() => {
    setGapiLastRemoteUpdates(null);
  }, []);

  useEffect(() => { initClient(); }, [gapiStorage, initClient]);

  useEffect(() => { applyToken(); }, [applyToken]);

  // start polling
  useEffect(() => {
    if (!isReady || !gapiClient) {
      return;
    }

    const handle = setTimeout(updateSheets, 1);
    return () => clearTimeout(handle);
  }, [gapiClient, isReady, updateSheets]);

  useEffect(() => {
    return () => window.clearTimeout(refreshHandle.current);
  }, []);

  return {
    busy,
    isReady,
    enqueueSheetsClientRequest,
    sheets,
    gapiLastRemoteUpdates,
    updateSheets,
    clearGapiLastRemoteUpdates,
  };
};
