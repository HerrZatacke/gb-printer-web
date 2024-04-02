/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';


const printerParamsReducer = (value = '', action) => {
  switch (action.type) {
    case Actions.SET_PRINTER_PARAMS:
      return action.payload;

    case Actions.GLOBAL_UPDATE:
      return updateIfDefined(action.payload.printerParams, value);
    default:
      return value;
  }
};

export default printerParamsReducer;
