import Sockette from '../../../libs/sockette';

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
          .forEach((rawLine) => {
            // commented lines are not saved
            if ((rawLine.charAt(0) === '#')) {
              return;
            }

            // ! indicates a command
            if ((rawLine.charAt(0) === '!')) {
              try {
                const { command } = JSON.parse(rawLine.slice(1).trim());
                if (command === 'INIT') {
                  store.dispatch({
                    type: 'CLEAR_LINES',
                    payload: rawLine,
                  });
                }
              } catch (error) {
                store.dispatch({
                  type: 'PARSE_ERROR',
                  payload: 'Error while trying to parse JSON data command block',
                });
              }

              return;
            }

            store.dispatch({
              type: 'NEW_LINE',
              payload: rawLine,
            });
          });
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
