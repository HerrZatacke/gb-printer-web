import { useCallback, useEffect, useRef } from 'react';
import { PrinterFunction } from '@/consts/printerFunction';
import useImportFile from '@/hooks/useImportFile';
import {
  useDialogsStore,
  useInteractionsStore,
  useProgressStore,
  useSettingsStore,
} from '@/stores/stores';
import { type BlobResponse, FromPrinterEvent, type PrinterParams, type RemotePrinterEvent } from '@/types/Printer';

let heartbeatTimer: number | null;
let remotePrinterWindow: Window | null;

export interface RemotePrinterContextValue {
  callRemoteFunction: (functionType: PrinterFunction) => Promise<void>,
}

export const useContextHook = (): RemotePrinterContextValue => {
  const { setPrinterFunctions, setPrinterBusy, setPrinterData } = useInteractionsStore.getState();
  const { startProgress, setProgress, stopProgress } = useProgressStore.getState();
  const { dismissDialog, setDialog } = useDialogsStore.getState();
  const { handleFileImport } = useImportFile();
  const progressId = useRef<string>('');

  const showProgress = useCallback((progressValue: number): void => {
    const value = Math.min(1, Math.max(0, progressValue));

    if (progressId && (value === 0 || value === 1)) {
      stopProgress(progressId.current);
      progressId.current = '';
      return;
    }

    if (!progressId.current) {
      progressId.current = startProgress('Getting items from printer');
    }

    setProgress(progressId.current, value);
  }, [setProgress, startProgress, stopProgress]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<RemotePrinterEvent>) => {
      const { printerUrl } = useSettingsStore.getState();
      const origin = new URL(printerUrl).origin;
      const sourceWindow = event.source as Window;

      if (event.origin !== origin) {
        return;
      }

      const fromRemotePrinter: FromPrinterEvent | undefined = event.data.fromRemotePrinter;

      if (!fromRemotePrinter) {
        return;
      }

      const {
        progress,
        blobsdone,
        commands,
        printerData,
      } = fromRemotePrinter;

      if (commands) {
        if (
          !heartbeatTimer ||
          JSON.stringify(commands) !== JSON.stringify(useInteractionsStore.getState().printerFunctions)) {
          setPrinterFunctions(commands);
          setPrinterBusy(false);
          setPrinterData(null);
        }

        remotePrinterWindow = sourceWindow;

        window.clearTimeout(heartbeatTimer as number);
        heartbeatTimer = window.setTimeout(() => {
          heartbeatTimer = null;
          remotePrinterWindow = null;
          setPrinterBusy(true);
          setPrinterData(null);
          setPrinterFunctions([]);
        }, 1500);
      }

      if (progress !== undefined) {
        showProgress(progress);
      }

      if (blobsdone) {
        const files = blobsdone.reduce((acc: File[], response: BlobResponse): File[] => {
          if (!response.blob || !response.ok) {
            return acc;
          }

          const indexText = blobsdone.length > 1 ? (acc.length + 1).toString(10).padStart(2, '0') : '';

          return [
            ...acc,
            new File([response.blob], `Printer ${indexText}`.trim(), { type: response.contentType }),
          ];
        }, []);


        if (files.length) {
          handleFileImport(files, { fromPrinter: true });
        } else {
          setDialog({
            message: 'No valid files received from WiFi-Printer',
            confirm: async () => {
              dismissDialog(0);
              setPrinterBusy(false);
              setPrinterData(null);
            },
          });
        }
      }

      if (printerData) {
        setPrinterData(printerData);
        setPrinterBusy(false);
      }

    };

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);

  }, [dismissDialog, handleFileImport, setDialog, setPrinterBusy, setPrinterData, setPrinterFunctions, showProgress]);

  const callRemoteFunction = useCallback(async (functionType: PrinterFunction) => {
    const { printerData } = useInteractionsStore.getState();
    setPrinterBusy(true);
    let params: PrinterParams | undefined;

    if (functionType === PrinterFunction.FETCHIMAGES && printerData) {
      params = { dumps: printerData?.dumps };
    }

    // obh and pako need to be loaded here, as the trigger from the
    // remote window might cause the files not to be loaded correctly
    await import(/* webpackChunkName: "obh" */ 'object-hash');
    await import(/* webpackChunkName: "pko" */ 'pako');

    if (!remotePrinterWindow) {
      throw new Error('remote printer window object is missing');
    }

    remotePrinterWindow.postMessage({
      toRemotePrinter: {
        command: functionType,
        params,
      },
    } as RemotePrinterEvent, '*');
  }, [setPrinterBusy]);

  return {
    callRemoteFunction,
  };
};
