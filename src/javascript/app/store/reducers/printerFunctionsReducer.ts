/* eslint-disable default-param-last */
import { Actions } from '../actions';

import {
  PrinterFunctionsReceivedAction,
  PrinterTimedOutAction,
} from '../../../../types/actions/PrinterActions';

const printerFunctionsReducer = (
  value: object[] = [],
  action:
    PrinterTimedOutAction |
    PrinterFunctionsReceivedAction,
): object[] => {
  switch (action.type) {
    case Actions.PRINTER_FUNCTIONS_RECEIVED:
      return action.payload;
    case Actions.HEARTBEAT_TIMED_OUT:
      return [];
    default:
      return value;
  }
};

export default printerFunctionsReducer;
