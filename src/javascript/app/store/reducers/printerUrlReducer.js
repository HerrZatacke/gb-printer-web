import cleanUrl from '../../../tools/cleanUrl';
import updateIfDefined from '../../../tools/updateIfDefined';
import { GLOBAL_UPDATE, SET_PRINTER_URL } from '../actions';

const printerUrlReducer = (value = '', action) => {
  switch (action.type) {
    case SET_PRINTER_URL:
      return cleanUrl(action.payload, 'http');

    case GLOBAL_UPDATE:
      return updateIfDefined(action.payload.printerUrl, value);
    default:
      return value;
  }
};

export default printerUrlReducer;
