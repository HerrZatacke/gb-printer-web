import { useCallback } from 'react';

const useClearPrinter = (setBusy, checkPrinter) => (useCallback(() => {
  setBusy(true);
  fetch('/dumps/clear')
    .then((res) => res.json())
    .then(({ deleted }) => {
      if (deleted !== undefined) {
        checkPrinter();
        setBusy(false);
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-alert
      alert(error.message);
      setBusy(false);
    });
}, [setBusy, checkPrinter]));

export default useClearPrinter;
