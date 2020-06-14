const printerDataReducer = (value = {}, action) => {
  switch (action.type) {
    case 'PRINTER_QUERY':
      return {};
    case 'PRINTER_DATA':
      return action.payload;
    default:
      return value;
  }
};

export default printerDataReducer;
