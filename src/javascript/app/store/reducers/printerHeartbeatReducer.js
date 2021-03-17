const printerHeartbeatReducer = (value = 0, action) => {
  switch (action.type) {
    case 'HEARTBEAT_RECEIVED':
      return action.payload;
    case 'HEARTBEAT_TIMED_OUT':
      return 0;
    default:
      return value;
  }
};

export default printerHeartbeatReducer;
