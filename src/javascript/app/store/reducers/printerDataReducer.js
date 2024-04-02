/* eslint-disable default-param-last */
import { Actions } from '../actions';


const printerDataReducer = (value = {}, action) => {
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
