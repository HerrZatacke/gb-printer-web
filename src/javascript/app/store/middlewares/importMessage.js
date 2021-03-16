const importMessage = (store) => {

  let heartbeatTimer = null;

  window.addEventListener('message', (event) => {
    const { printerUrl } = store.getState();
    const { origin } = new URL(printerUrl);

    if (event.origin !== origin) {
      return;
    }

    const { remotePrinter: { lines, heartbeat, blob } = {} } = event.data;

    if (heartbeat) {
      if (!heartbeatTimer) {
        store.dispatch({
          type: 'HEARTBEAT_RECEIVED',
        });
      }

      window.clearTimeout(heartbeatTimer);
      heartbeatTimer = window.setTimeout(() => {
        heartbeatTimer = null;
        store.dispatch({
          type: 'HEARTBEAT_TIMED_OUT',
        });
      }, 800);
    }

    if (lines) {
      let file;
      try {
        file = new File([...lines.join('\n')], 'Text input.txt', { type: 'text/plain' });
      } catch (error) {
        file = new Blob([...lines.join('\n')], { type: 'text/plain' });
      }

      store.dispatch({
        type: 'IMPORT_FILE',
        payload: { files: [file] },
      });
    }

    if (blob) {
      store.dispatch({
        type: 'IMPORT_FILE',
        payload: { files: [blob] },
      });
    }

  });


  return (next) => (action) => {

    next(action);
  };
};

export default importMessage;
