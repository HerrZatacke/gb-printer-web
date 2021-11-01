import updateIfDefined from '../../../tools/updateIfDefined';
import { GLOBAL_UPDATE, SET_PRINTER_PARAMS } from '../actions';

const printerParamsReducer = (value = '', action) => {
  switch (action.type) {
    case SET_PRINTER_PARAMS:
      return action.payload;

    case GLOBAL_UPDATE:
      return updateIfDefined(action.payload.printerParams, value);
    default:
      return value;
  }
};

export default printerParamsReducer;
