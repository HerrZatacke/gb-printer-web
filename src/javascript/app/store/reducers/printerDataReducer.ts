/* eslint-disable default-param-last */
import { Actions } from '../actions';
import {
  PrinterDataReceivedAction,
  PrinterResetAction,
  PrinterTimedOutAction,
} from '../../../../types/actions/PrinterActions';


const printerDataReducer = (
  value: object = {},
  action:
    PrinterDataReceivedAction |
    PrinterResetAction |
    PrinterTimedOutAction,
): object => {
  switch (action.type) {
    case Actions.PRINTER_DATA_RECEIVED:
      return action.payload;
    case Actions.PRINTER_RESET:
    case Actions.HEARTBEAT_TIMED_OUT:
      return {};
    default:
      return value;
  }
};

export default printerDataReducer;
