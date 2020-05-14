import Sockette from '../../../libs/sockette';
import handleLines from '../../../tools/handleLines';

const newSocket = (dispatch, socketUrl) => {
  let silenceTimeout = null;

  return new Sockette(socketUrl, {
    timeout: 5000,
    maxAttempts: 10,
    onstatechange: (readyState) => {
      dispatch({
        type: 'SET_SOCKET_STATE',
        payload: readyState,
      });
    },
    onmessage: ({ data }) => {
      window.clearTimeout(silenceTimeout);

      // Let the live-image disappear after a few seconds
      silenceTimeout = window.setTimeout(() => {
        dispatch({
          type: 'CLEAR_LINES',
        });
      }, 5000);

      data
        .split('\n')
        .map(handleLines)
        .filter(Boolean)
        .forEach(dispatch);
    },
  });
};

const serialportWebocket = (store) => {

  const socketUrl = store.getState().socketUrl;

  let socket;

  // Do not autoconnect when on prod
  if (socketUrl && window.location.protocol !== 'https:') {
    window.setTimeout(() => {
      socket = newSocket(store.dispatch, `ws://${socketUrl}`);
    }, 1000);
  }

  return (next) => (action) => {
    if (action.type === 'SET_SOCKET_URL') {
      const protocolSocketUrl = `ws://${action.payload}`;
      if (socket) {
        socket.setUrl(protocolSocketUrl);
      } else {
        socket = newSocket(store.dispatch, protocolSocketUrl);
      }
    }

    return next(action);
  };
};

export default serialportWebocket;
