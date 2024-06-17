/* eslint-disable default-param-last */
import { Actions } from '../actions';
import type {
  PrinterDataReceivedAction,
  PrinterResetAction,
  PrinterTimedOutAction,
} from '../../../../types/actions/PrinterActions';
import type { PrinterInfo } from '../../../../types/Printer';

const printerDataReducer = (
  value: PrinterInfo | null = null,
  action:
    PrinterDataReceivedAction |
    PrinterResetAction |
    PrinterTimedOutAction,
): PrinterInfo | null => {
  switch (action.type) {
    case Actions.PRINTER_DATA_RECEIVED:
      return action.payload;
    case Actions.PRINTER_RESET:
    case Actions.HEARTBEAT_TIMED_OUT:
      return null;
    default:
      return value;
  }
};

export default printerDataReducer;
