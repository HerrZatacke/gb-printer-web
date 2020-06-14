import cleanUrl from '../../../tools/cleanUrl';

const socketUrlReducer = (value = '', action) => {
  switch (action.type) {
    case 'SET_SOCKET_URL':
      return cleanUrl(action.payload, 'ws');
    case 'GLOBAL_UPDATE':
      return action.payload.socketUrl || value;
    default:
      return value;
  }
};

export default socketUrlReducer;
