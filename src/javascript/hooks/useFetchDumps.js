import { useCallback } from 'react';

const useFetchDumps = (setBusy, dumps, targetWindow) => (
  useCallback(() => {
    setBusy(true);
    const fnFetch = (remainingDumps) => {
      const nextDump = remainingDumps.shift();

      if (!nextDump) {
        setBusy(false);
        return;
      }

      fetch(`/${nextDump.replace(/^\//, '')}`)
        .then((res) => res.blob())
        .then((blob) => {

          targetWindow.postMessage({ remotePrinter: {
            blob,
          } }, '*');

          window.setTimeout(() => {
            fnFetch(remainingDumps);
          }, 200);
        })
        .catch((error) => {
          // eslint-disable-next-line no-alert
          alert(error.message);
          setBusy(false);
        });
    };

    fnFetch([...dumps]);
  }, [setBusy, dumps, targetWindow])
);

export default useFetchDumps;
