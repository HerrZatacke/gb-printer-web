/* eslint-disable default-param-last */
import cleanUrl from '../../../tools/cleanUrl';
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';
import type { PrinterSetUrlAction } from '../../../../types/actions/PrinterActions';
import type { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';

const printerUrlReducer = (
  value = '',
  action: PrinterSetUrlAction | GlobalUpdateAction,
): string => {
  switch (action.type) {
    case Actions.SET_PRINTER_URL:
      return cleanUrl(action.payload, 'http');

    case Actions.GLOBAL_UPDATE:
      return updateIfDefined<string>(action.payload?.printerUrl, value);
    default:
      return value;
  }
};

export default printerUrlReducer;
