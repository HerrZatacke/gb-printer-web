/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import { PrinterSetParamsAction } from '../../../../types/actions/PrinterActions';

const printerParamsReducer = (
  value = '',
  action: PrinterSetParamsAction | GlobalUpdateAction,
): string => {
  switch (action.type) {
    case Actions.SET_PRINTER_PARAMS:
      return action.payload;

    case Actions.GLOBAL_UPDATE:
      return updateIfDefined<string>(action.payload?.printerParams, value);
    default:
      return value;
  }
};

export default printerParamsReducer;
