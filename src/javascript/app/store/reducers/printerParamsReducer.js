import updateIfDefined from '../../../tools/updateIfDefined';

const printerParamsReducer = (value = '', action) => {
  switch (action.type) {
    case 'SET_PRINTER_PARAMS':
      return action.payload;

    case 'GLOBAL_UPDATE':
      return updateIfDefined(action.payload.printerParams, value);
    default:
      return value;
  }
};

export default printerParamsReducer;
