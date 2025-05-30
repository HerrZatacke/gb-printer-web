import type { PrinterFunction } from '../consts/printerFunction';
import type { PrinterInfo } from '../../types/Printer';
import useInteractionsStore from '../app/stores/interactionsStore';
import { useRemotePrinterContext } from '../app/contexts/remotePrinter';

interface UsePrinter {
  printerData: PrinterInfo | null,
  printerFunctions: PrinterFunction[],
  printerConnected: boolean,
  printerBusy: boolean,
  callRemoteFunction: (name: PrinterFunction) => void,
}

export const usePrinter = (): UsePrinter => {
  const { printerData, printerFunctions, printerBusy } = useInteractionsStore();
  const { callRemoteFunction } = useRemotePrinterContext();

  const printerConnected = printerFunctions.length > 0;

  return {
    printerData,
    printerFunctions,
    printerBusy,
    printerConnected,
    callRemoteFunction,
  };
};
