/* eslint-disable default-param-last */
import { Actions } from '../actions';

const printerFunctionsReducer = (value = [], action) => {
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
