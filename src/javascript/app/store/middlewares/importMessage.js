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

    const { fromRemotePrinter: { lines, progress, blob, blobsdone, commands, printerData } = {} } = event.data;
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
        type: 'IMPORT_FILES',
        payload: { files: [file] },
      });
    }

    if (progress !== undefined) {
      store.dispatch({
        type: 'PRINTER_PROGRESS',
        payload: progress,
      });
    }

    // fallback for printers with web-app version < 1.15.5 to display some "fake" progress..
    if (blob) {
      store.dispatch({
        type: 'IMPORT_FILES',
        payload: { files: [blob] },
      });
    }

    if (blobsdone) {
      if (typeof blobsdone[0] === 'string') {
        window.setTimeout(() => {
          // eslint-disable-next-line no-alert
          alert('You should update the web-app to a version > 1.16.0 on your printer for an optimized import experience :-)');
        }, 200);
        return;
      }

      store.dispatch({
        type: 'IMPORT_FILES',
        payload: { files: blobsdone },
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
      case 'REMOTE_CALL_FUNCTION': {
        const state = store.getState();
        const params = (action.payload === 'fetchImages') ?
          { dumps: state.printerData?.dumps } : undefined;

        remotePrinterWindow.postMessage({
          toRemotePrinter: {
            command: action.payload,
            params,
          },
        }, '*');
        break;
      }

      default:
        break;
    }

    next(action);
  };
};

export default importMessage;
