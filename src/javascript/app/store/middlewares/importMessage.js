const importMessage = (store) => {

  window.addEventListener('message', (event) => {
    const { printerUrl } = store.getState();
    const { origin } = new URL(printerUrl);

    if (event.origin !== origin) {
      return;
    }

    const { remotePrinter: message } = event.data;

    if (!message) {
      return;
    }

    let file;
    try {
      file = new File([...message], 'Text input.txt', { type: 'text/plain' });
    } catch (error) {
      file = new Blob([...message], { type: 'text/plain' });
    }

    store.dispatch({
      type: 'IMPORT_FILE',
      payload: { files: [file] },
    });
  });


  return (next) => (action) => {

    next(action);
  };
};

export default importMessage;
