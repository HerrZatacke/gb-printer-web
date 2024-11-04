import { Actions } from '../actions';
import useSettingsStore from '../../stores/settingsStore';
import useInteractionsStore from '../../stores/interactionsStore';
import type { NamedFile, PrinterParams, RemotePrinterEvent } from '../../../../types/Printer';
import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import type { ConfirmAnsweredAction, ConfirmAskAction } from '../../../../types/actions/ConfirmActions';
import type { ImportFilesAction } from '../../../../types/actions/ImportActions';
import { PrinterFunction } from '../../../consts/printerFunction';

const importMessage: MiddlewareWithState = (store) => {

  let heartbeatTimer: number | null;
  let remotePrinterWindow: Window | null;

  const { setProgress, setPrinterFunctions, setPrinterBusy, setPrinterData } = useInteractionsStore.getState();

  window.addEventListener('message', (event: MessageEvent<RemotePrinterEvent>) => {
    const { printerUrl } = useSettingsStore.getState();
    let origin: string;

    try {
      origin = new URL(printerUrl).origin;
    } catch (error) {
      origin = new URL(window.location.href).origin;
    }

    if (event.origin !== origin) {
      return;
    }

    const { fromRemotePrinter: {
      lines,
      progress,
      blob,
      blobsdone,
      commands,
      printerData,
    } = {} } = event.data;
    const sourceWindow = event.source as Window;

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

    if (lines) {
      let file: File | Blob;
      try {
        file = new File([lines.join('\n')], 'Text input.txt', { type: 'text/plain' });
      } catch (error) {
        file = new Blob([lines.join('\n')], { type: 'text/plain' });
      }

      store.dispatch<ImportFilesAction>({
        type: Actions.IMPORT_FILES,
        payload: { files: [file] },
      });
    }

    if (progress !== undefined) {
      setProgress('printer', progress);
    }

    // fallback for printers with web-app version < 1.15.5 to display some "fake" progress..
    if (blob) {
      store.dispatch<ImportFilesAction>({
        type: Actions.IMPORT_FILES,
        payload: { files: [blob] },
      });
    }

    if (blobsdone) {
      if (typeof blobsdone[0] === 'string') {
        window.setTimeout(() => {
          // eslint-disable-next-line no-alert
          alert('You should update the web-app to a version > 1.16.0 on your printer for an optimized import experience :-)');
        }, 200);
        return;
      }

      const files = blobsdone.filter((response): boolean => Boolean(response.blob && response.ok));

      const namedFiles = files.map((file, index): NamedFile => {
        const indexText = files.length > 1 ? (index + 1).toString(10).padStart(2, '0') : '';
        return ({
          ...file,
          blobName: `Printer ${indexText}`.trim(),
        });
      });


      if (namedFiles.length) {
        store.dispatch<ImportFilesAction>({
          type: Actions.IMPORT_FILES,
          payload: {
            files: namedFiles,
            fromPrinter: true,
          },
        });
      } else {
        store.dispatch<ConfirmAskAction>({
          type: Actions.CONFIRM_ASK,
          payload: {
            message: 'No valid files received from WiFi-Printer',
            confirm: async () => {
              store.dispatch<ConfirmAnsweredAction>({
                type: Actions.CONFIRM_ANSWERED,
              });
              setPrinterBusy(false);
              setPrinterData(null);
            },
          },
        });
      }
    }

    if (printerData) {
      setPrinterData(printerData);
      setPrinterBusy(false);
    }

  });


  return (next) => async (action) => {

    switch (action.type) {
      case Actions.REMOTE_CALL_FUNCTION: {
        const { printerData } = useInteractionsStore.getState();
        setPrinterBusy(true);
        let params: PrinterParams | undefined;

        if (action.payload === PrinterFunction.FETCHIMAGES && printerData) {
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
            command: action.payload,
            params,
          },
        } as RemotePrinterEvent, '*');

        break;
      }

      default:
        break;
    }

    next(action);
  };
};

export default importMessage;
