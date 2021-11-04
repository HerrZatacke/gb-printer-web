import { HEARTBEAT_TIMED_OUT, PRINTER_DATA_RECEIVED, PRINTER_RESET } from '../actions';

const printerDataReducer = (value = {}, action) => {
  switch (action.type) {
    case PRINTER_DATA_RECEIVED:
      return action.payload;
    case PRINTER_RESET:
    case HEARTBEAT_TIMED_OUT:
      return {};
    default:
      return value;
  }
};

export default printerDataReducer;
