import type { PrinterFunction } from '@/consts/printerFunction';
import { useRemotePrinterContext } from '@/contexts/remotePrinter';
import useInteractionsStore from '@/stores/interactionsStore';
import type { PrinterInfo } from '@/types/Printer';

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
