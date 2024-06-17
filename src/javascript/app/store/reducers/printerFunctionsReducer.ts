/* eslint-disable default-param-last */
import { Actions } from '../actions';

import {
  PrinterFunctionsReceivedAction,
  PrinterTimedOutAction,
} from '../../../../types/actions/PrinterActions';

const printerFunctionsReducer = (
  value: string[] = [],
  action:
    PrinterTimedOutAction |
    PrinterFunctionsReceivedAction,
): string[] => {
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
