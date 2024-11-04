import { useDispatch } from 'react-redux';
import { Actions } from '../../store/actions';
import type { PrinterFunction } from '../../../consts/printerFunction';
import type { PrinterInfo } from '../../../../types/Printer';
import type { PrinterRemoteCallAction } from '../../../../types/actions/PrinterActions';
import useInteractionsStore from '../../stores/interactionsStore';

interface UsePrinter {
  printerData: PrinterInfo | null,
  printerFunctions: PrinterFunction[],
  printerConnected: boolean,
  printerBusy: boolean,
  callRemoteFunction: (name: PrinterFunction) => void,
}

export const usePrinter = (): UsePrinter => {
  const { printerData, printerFunctions, printerBusy } = useInteractionsStore();

  const dispatch = useDispatch();

  const printerConnected = printerFunctions.length > 0;

  return {
    printerData,
    printerFunctions,
    printerBusy,
    printerConnected,
    callRemoteFunction: (name: PrinterFunction) => {
      dispatch<PrinterRemoteCallAction>({
        type: Actions.REMOTE_CALL_FUNCTION,
        payload: name,
      });
    },
  };
};
