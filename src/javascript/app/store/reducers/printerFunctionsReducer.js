import { HEARTBEAT_TIMED_OUT, PRINTER_FUNCTIONS_RECEIVED } from '../actions';

const printerFunctionsReducer = (value = [], action) => {
  switch (action.type) {
    case PRINTER_FUNCTIONS_RECEIVED:
      return action.payload;
    case HEARTBEAT_TIMED_OUT:
      return [];
    default:
      return value;
  }
};

export default printerFunctionsReducer;
