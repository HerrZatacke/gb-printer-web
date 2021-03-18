const printerFunctionsReducer = (value = [], action) => {
  switch (action.type) {
    case 'PRINTER_FUNCTIONS_RECEIVED':
      return action.payload;
    case 'HEARTBEAT_TIMED_OUT':
      return [];
    default:
      return value;
  }
};

export default printerFunctionsReducer;
