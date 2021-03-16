const printerHeartbeatReducer = (value = false, action) => {
  switch (action.type) {
    case 'HEARTBEAT_RECEIVED':
      return true;
    case 'HEARTBEAT_TIMED_OUT':
      return false;
    default:
      return value;
  }
};

export default printerHeartbeatReducer;
