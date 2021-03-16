import { useCallback } from 'react';

const useCheckPrinter = (setBusy, setPrinterData, setDumpCount) => (
  useCallback(() => {
    setBusy(true);
    setPrinterData({});
    fetch('/dumps/list')
      .then((res) => res.json())
      .then((data) => {
        // the ArduinoJSON library strangely sometimes did not include all items in the list, so this is a basic check.
        if (data.fs.dumpcount !== data.dumps.length) {
          // eslint-disable-next-line no-alert
          alert('Inconststent image count received from printer.');
        }

        setPrinterData({
          ...data,
          dumps: [...data.dumps].sort(),
        });
        setDumpCount(data.fs.dumpcount);
        setBusy(false);
      })
      .catch((error) => {
        // eslint-disable-next-line no-alert
        alert(error.message);
        setBusy(false);
      });
  }, [setBusy, setPrinterData, setDumpCount])
);

export default useCheckPrinter;
