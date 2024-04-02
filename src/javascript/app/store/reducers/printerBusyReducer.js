/* eslint-disable default-param-last */
import { Actions } from '../actions';


const printerBusyReducer = (value = false, action) => {
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
