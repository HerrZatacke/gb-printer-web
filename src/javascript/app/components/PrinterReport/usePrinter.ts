import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../store/actions';
import type { State } from '../../store/State';
import type { PrinterFunction } from '../../../consts/printerFunction';
import type { PrinterInfo } from '../../../../types/Printer';
import type { PrinterRemoteCallAction } from '../../../../types/actions/PrinterActions';

interface UsePrinter {
  printerData: PrinterInfo,
  printerFunctions: PrinterFunction[],
  printerConnected: boolean,
  printerBusy: boolean,
  callRemoteFunction: (name: PrinterFunction) => void,
}

export const usePrinter = (): UsePrinter => {
  const printerInfo = useSelector((state: State) => ({
    printerData: state.printerData,
    printerFunctions: state.printerFunctions,
    printerBusy: state.printerBusy,
  }));
  const dispatch = useDispatch();

  const printerConnected = printerInfo.printerFunctions.length > 0;

  return {
    ...printerInfo,
    printerConnected,
    callRemoteFunction: (name: PrinterFunction) => {
      dispatch<PrinterRemoteCallAction>({
        type: Actions.REMOTE_CALL_FUNCTION,
        payload: name,
      });
    },
  };
};
