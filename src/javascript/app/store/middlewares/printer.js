import getHandleFileImport from '../../../tools/getHandleFileImport';

const getFetchDumps = (dispatch, printerUrl) => (dumps) => (
  new Promise(((resolve) => {

    const handleFileImport = getHandleFileImport(dispatch);

    const fnFetch = (remainingDumps) => {
      const nextDump = remainingDumps.shift();
      if (!nextDump) {
        resolve();
        return;
      }

      fetch(`${printerUrl}${nextDump}`)
        .then((res) => res.blob())
        .then((dump) => {
          handleFileImport(dump);

          window.setTimeout(() => {
            fnFetch(remainingDumps);
          }, 200);
        })
        .catch((error) => {
          dispatch({
            type: 'ERROR',
            payload: error.message,
          });
        });
    };

    fnFetch(dumps);
  }))
);

const printer = (store) => (next) => (action) => {

  // const printerUrl = 'http://192.168.0.14';
  const state = store.getState();
  const { printerUrl } = state;

  if (action.type === 'PRINTER_QUERY') {
    fetch(`${printerUrl}/dumps/list`)
      .then((res) => res.json())
      .then((printerData) => {

        // the ArduinoJSON library strangely sometimes did not include all items in the list, so this is a basic check.
        if (printerData.fs.dumpcount !== printerData.dumps.length) {
          throw new Error('Inconststent image count received from printer.');
        }

        store.dispatch({
          type: 'PRINTER_DATA',
          payload: printerData,
        });

      })
      .catch((error) => {
        store.dispatch({
          type: 'ERROR',
          payload: error.message,
        });
      });
  }

  if (action.type === 'PRINTER_DOWNLOAD') {
    const { printerData: { dumps } } = state;
    const fetchDumps = getFetchDumps(store.dispatch, printerUrl);

    if (dumps && dumps.length) {
      fetchDumps([...dumps]);
    }
  }

  if (action.type === 'PRINTER_CLEAR') {
    fetch(`${printerUrl}/dumps/clear`)
      .then((res) => res.json())
      .then(({ deleted }) => {
        if (deleted) {
          store.dispatch({
            type: 'PRINTER_QUERY',
          });
        }
      });
  }

  next(action);
};

export default printer;
