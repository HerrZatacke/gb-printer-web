import cleanUrl from '../../../tools/cleanUrl';
import updateIfDefined from '../../../tools/updateIfDefined';

const socketUrlReducer = (value = '', action) => {
  switch (action.type) {
    case 'SET_SOCKET_URL':
      return cleanUrl(action.payload, 'ws');
    case 'GLOBAL_UPDATE':
      return updateIfDefined(action.payload.socketUrl, value);
    default:
      return value;
  }
};

export default socketUrlReducer;
