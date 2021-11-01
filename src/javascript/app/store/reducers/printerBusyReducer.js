import {
  ADD_IMAGES,
  HEARTBEAT_TIMED_OUT,
  PRINTER_DATA_RECEIVED,
  PRINTER_FUNCTIONS_RECEIVED,
  REMOTE_CALL_FUNCTION,
} from '../actions';

const printerBusyReducer = (value = false, action) => {
  switch (action.type) {
    case REMOTE_CALL_FUNCTION:
    case HEARTBEAT_TIMED_OUT:
      return true;
    case ADD_IMAGES:
    case PRINTER_FUNCTIONS_RECEIVED:
    case PRINTER_DATA_RECEIVED:
      return false;
    default:
      return value;
  }
};

export default printerBusyReducer;
