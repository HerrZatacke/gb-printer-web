/* eslint-disable default-param-last */
import cleanUrl from '../../../tools/cleanUrl';
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';


const printerUrlReducer = (value = '', action) => {
  switch (action.type) {
    case Actions.SET_PRINTER_URL:
      return cleanUrl(action.payload, 'http');

    case Actions.GLOBAL_UPDATE:
      return updateIfDefined(action.payload.printerUrl, value);
    default:
      return value;
  }
};

export default printerUrlReducer;
