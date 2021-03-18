const printerBusyReducer = (value = false, action) => {
  switch (action.type) {
    case 'REMOTE_CALL_FUNCTION':
    case 'HEARTBEAT_TIMED_OUT':
      return true;
    case 'PRINTER_FUNCTIONS_RECEIVED':
    case 'PRINTER_READY':
    case 'PRINTER_DATA_RECEIVED':
      return false;
    default:
      return value;
  }
};

export default printerBusyReducer;
