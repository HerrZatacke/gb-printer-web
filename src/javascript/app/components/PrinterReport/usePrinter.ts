import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../store/actions';
import { State } from '../../store/State';
import { PrinterInfo } from '../../../../types/Printer';
import { PrinterFunctionName, PrinterRemoteCallAction } from '../../../../types/actions/PrinterActions';

interface UsePrinter {
  printerData: PrinterInfo,
  printerFunctions: PrinterFunctionName[],
  printerConnected: boolean,
  printerBusy: boolean,
  callRemoteFunction: (name: PrinterFunctionName) => void,
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
    callRemoteFunction: (name: PrinterFunctionName) => {
      dispatch({
        type: Actions.REMOTE_CALL_FUNCTION,
        payload: name,
      } as PrinterRemoteCallAction);
    },
  };
};
