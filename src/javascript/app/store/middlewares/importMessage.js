const importMessage = (store) => {

  let heartbeatTimer = null;
  let remotePrinterWindow = null;

  window.addEventListener('message', (event) => {
    const { printerUrl } = store.getState();
    let origin;

    try {
      origin = new URL(printerUrl).origin;
    } catch (error) {
      origin = new URL(window.location.href).origin;
    }

    if (event.origin !== origin) {
      return;
    }

    const { fromRemotePrinter: { lines, blobs, commands, printerData } = {} } = event.data;
    const sourceWindow = event.source;

    if (commands) {
      if (
        !heartbeatTimer ||
        JSON.stringify(commands) !== JSON.stringify(store.getState().printerFunctions)) {
        store.dispatch({
          type: 'PRINTER_FUNCTIONS_RECEIVED',
          payload: commands,
        });
      }

      remotePrinterWindow = sourceWindow;

      window.clearTimeout(heartbeatTimer);
      heartbeatTimer = window.setTimeout(() => {
        heartbeatTimer = null;
        remotePrinterWindow = null;
        store.dispatch({
          type: 'HEARTBEAT_TIMED_OUT',
        });
      }, 1500);
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

      store.dispatch({
        type: 'PRINTER_READY',
      });
    }

    if (blobs) {
      blobs.forEach(((blob) => {
        store.dispatch({
          type: 'IMPORT_FILE',
          payload: { files: [blob] },
        });
      }));

      store.dispatch({
        type: 'PRINTER_READY',
      });
    }

    if (printerData) {
      store.dispatch({
        type: 'PRINTER_DATA_RECEIVED',
        payload: printerData,
      });
    }

  });


  return (next) => (action) => {

    switch (action.type) {
      case 'REMOTE_CALL_FUNCTION':
        remotePrinterWindow.postMessage({ toRemotePrinter: { command: action.payload } }, '*');
        break;
      default:
        break;
    }

    next(action);
  };
};

export default importMessage;
