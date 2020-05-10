const socketUrlReducer = (value = '', action) => {
  switch (action.type) {
    case 'SET_SOCKET_URL':
      return action.payload;
    default:
      return value;
  }
};

export default socketUrlReducer;
