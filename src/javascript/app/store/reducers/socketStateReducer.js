const socketStateReducer = (value = WebSocket.CLOSED, action) => {
  switch (action.type) {
    case 'SET_SOCKET_STATE':
      return action.payload;
    default:
      return value;
  }
};

export default socketStateReducer;
