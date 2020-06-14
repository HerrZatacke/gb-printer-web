const printerUrlReducer = (value = '', action) => {
  switch (action.type) {
    case 'SET_PRINTER_URL':
      return action.payload;
    case 'GLOBAL_UPDATE':
      return action.payload.printerUrl || value;
    default:
      return value;
  }
};

export default printerUrlReducer;
