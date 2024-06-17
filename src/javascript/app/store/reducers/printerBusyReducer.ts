/* eslint-disable default-param-last */
import { Actions } from '../actions';
import type {
  PrinterDataReceivedAction,
  PrinterFunctionsReceivedAction,
  PrinterRemoteCallAction,
  PrinterResetAction,
  PrinterTimedOutAction,
} from '../../../../types/actions/PrinterActions';
import type { AddImagesAction } from '../../../../types/actions/ImageActions';
import type { ImportQueueCancelAction } from '../../../../types/actions/QueueActions';


const printerBusyReducer = (
  value = false,
  action:
    AddImagesAction |
    ImportQueueCancelAction |
    PrinterRemoteCallAction |
    PrinterTimedOutAction |
    PrinterFunctionsReceivedAction |
    PrinterDataReceivedAction |
    PrinterResetAction,
): boolean => {
  switch (action.type) {
    case Actions.REMOTE_CALL_FUNCTION:
    case Actions.HEARTBEAT_TIMED_OUT:
      return true;
    case Actions.ADD_IMAGES:
    case Actions.PRINTER_FUNCTIONS_RECEIVED:
    case Actions.PRINTER_DATA_RECEIVED:
    case Actions.PRINTER_RESET:
    case Actions.IMPORTQUEUE_CANCEL:
      return false;
    default:
      return value;
  }
};

export default printerBusyReducer;
