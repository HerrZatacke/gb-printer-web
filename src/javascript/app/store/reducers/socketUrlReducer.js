const socketUrlReducer = (value = '', action) => {
  switch (action.type) {
    case 'SET_SOCKET_URL':
      return action.payload;
    case 'GLOBAL_UPDATE':
      return action.payload.socketUrl || value;
    default:
      return value;
  }
};

export default socketUrlReducer;
