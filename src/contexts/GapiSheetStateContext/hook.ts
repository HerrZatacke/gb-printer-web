import { hash as ohash } from 'ohash';
import Queue from 'promise-queue';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type GapiLastUpdates, sheetNames } from '@/contexts/GapiSheetStateContext/consts';
import { createGapiLastUpdates } from '@/contexts/GapiSheetStateContext/tools/createGapiLastUpdates';
import { isGapiError } from '@/contexts/GapiSheetStateContext/tools/isGapiError';
import { patchGapiClient } from '@/contexts/GapiSheetStateContext/tools/patchGapiClient';
import useGIS from '@/contexts/GisContext';
import { useLimitCounter } from '@/hooks/useLimitCounter';
import { useInteractionsStore, useStoragesStore } from '@/stores/stores';
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
  const { gapiStorage, setGapiSettings } = useStoragesStore();
  const { setError } = useInteractionsStore();
  const { isReady } = useGIS();
  const [busy, setBusy] = useState(false);
  const [gapiClient, setGapiClient] = useState<typeof gapi.client | null>(null);
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [gapiLastRemoteUpdates, setGapiLastRemoteUpdates] = useState<GapiLastUpdates | null>(null);
  const refreshHandle = useRef<number>(0);
  const { increaseLimit: increaseReads } = useLimitCounter(60000, 60);
  const { increaseLimit: increaseWrites } = useLimitCounter(60000, 60);
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
        if (isGapiError(error)) {
          setError(new Error(error.result.error.message));

          switch (error.status) {
            // too many requests
            case 429: {
              setGapiSettings({ autoSync: false });
              await delay(30000); // allow a new request after 30s;
              break;
            }

            case 404: {
              setGapiSettings({ sheetId: '', autoSync: false });
              break;
            }

            case 403: {
              setGapiSettings({ token: '', tokenExpiry: 0, autoSync: false });
              break;
            }

            default: // unhandled gapi error
              console.log(`Unhandled gapi error (${error.status}): `, error.result?.error?.message);
              setGapiSettings({ use: false });
              break;
          }
        } else {
          // Not a gapi error: re-throw
          setError(error as Error);
          throw error;
        }
      }
      setBusy(false);
    });
  }, [gapiClient?.sheets, setError, setGapiSettings]);

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

      setGapiClient(patchGapiClient(gapi.client, increaseReads, increaseWrites));
    });
  }, [gapiClient, gapiStorage.use, increaseReads, increaseWrites, isReady]);

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
    const { use, sheetId, tokenExpiry, token } = gapiStorage;

    if (!sheetId || !use || !token || !tokenExpiry) {
      console.log('📊 NOT updating sheet dates');
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
