import Sockette from '../../../libs/sockette';
import handleLines from '../../../tools/handleLines';
import { getEnv } from '../../../tools/getEnv';

const newSocket = (dispatch, socketUrl) => {

  let lineBuffer = [];

  const flush = () => {
    dispatch({
      type: 'NEW_LINES',
      payload: [...lineBuffer],
    });
    lineBuffer = [];
  };

  return (
    new Sockette(socketUrl, {
      timeout: 5000,
      maxAttempts: 10,
      onstatechange: (readyState) => {
        dispatch({
          type: 'SET_SOCKET_STATE',
          payload: readyState,
        });
      },
      onmessage: ({ data }) => {
        data
          .split('\n')
          .map(handleLines)
          .filter(Boolean)
          .forEach((lineAction) => {
            if (lineAction.type === 'NEW_LINES') {
              lineBuffer.push(...lineAction.payload);

              if (lineBuffer.length >= 40) {
                flush();
              }

            } else {
              flush();
              dispatch(lineAction);
            }
          });
      },
    })
  );
};

const serialportWebocket = (store) => {

  if (getEnv().env !== 'webpack-dev') {
    return (next) => (action) => {
      next(action);
    };
  }

  const socketUrl = store.getState().socketUrl;

  let socket;

  // Do not autoconnect when on prod
  if (socketUrl) {
    window.setTimeout(() => {
      socket = newSocket(store.dispatch, `${socketUrl}`);
    }, 1000);
  }

  return (next) => (action) => {
    if (action.type === 'SET_SOCKET_URL') {
      const protocolSocketUrl = `${action.payload}`;
      if (socket) {
        socket.setUrl(protocolSocketUrl);
      } else {
        socket = newSocket(store.dispatch, protocolSocketUrl);
      }
    }

    next(action);
  };
};

export default serialportWebocket;
