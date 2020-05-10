import Socket from '../../../tools/Socket';

const serialportWebocket = (store) => {

  const socket = new Socket({
    onMessage: (message) => {
      message.split('\n')
        .forEach((rawLine) => {
          // commented lines are not saved
          if ((rawLine.charAt(0) === '#')) {
            return;
          }

          // ! indicates a command
          if ((rawLine.charAt(0) === '!')) {
            try {
              const { command, more } = JSON.parse(rawLine.slice(1).trim());

              if (command === 'INIT') {
                store.dispatch({
                  type: 'CLEAR_LINES',
                });
                return;
              }

              if (command === 'DATA' && more === 0) {
                store.dispatch({
                  type: 'IMAGE_COMPLETE',
                });
                return;
              }

              return;
            } catch (error) {
              store.dispatch({
                type: 'PARSE_ERROR',
                payload: 'Error while trying to parse JSON data command block',
              });
              return;
            }

          }

          store.dispatch({
            type: 'NEW_LINE',
            payload: rawLine,
          });
        });
    },
  });

  const socketUrl = store.getState().socketUrl;
  if (socketUrl) {
    socket.connect(`ws://${socketUrl}/`);
  }

  return (next) => (action) => {
    if (action.type === 'SET_SOCKET_URL') {
      socket.connect(`ws://${action.payload}/`);
    }

    return next(action);
  };
};

export default serialportWebocket;
