import Sockette from '../../../libs/sockette';
import handleLines from '../../../tools/handleLines';

const serialportWebocket = (store) => {

  const socketUrl = store.getState().socketUrl;

  let socket;

  window.setTimeout(() => {
    socket = new Sockette(`ws://${socketUrl}`, {
      timeout: 5000,
      maxAttempts: 10,
      onstatechange: (readyState) => {
        store.dispatch({
          type: 'SET_SOCKET_STATE',
          payload: readyState,
        });
      },
      onmessage: ({ data }) => {
        data
          .split('\n')
          .map(handleLines)
          .filter(Boolean)
          .forEach(store.dispatch);
      },
    });
  }, 1000);

  return (next) => (action) => {
    if (action.type === 'SET_SOCKET_URL') {
      socket.setUrl(`ws://${action.payload}`);
    }

    return next(action);
  };
};

export default serialportWebocket;
