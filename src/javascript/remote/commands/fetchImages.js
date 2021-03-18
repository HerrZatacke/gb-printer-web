import checkPrinter from './checkPrinter';

const fetchImages = () => (
  // ToDo: pass desired list of dumps from main window and use Queue
  checkPrinter()
    .then(({ printerData: { dumps } }) => (

      new Promise((resolve, reject) => {
        const blobs = [];

        const fnFetch = (remainingDumps) => {
          const nextDump = remainingDumps.shift();

          if (!nextDump) {
            resolve({ blobs });
            return;
          }

          fetch(`/${nextDump.replace(/^\//, '')}`)
            .then((res) => res.blob())
            .then((blob) => {

              blobs.push(blob);

              window.setTimeout(() => {
                fnFetch(remainingDumps);
              }, 200);
            })
            .catch((error) => {
              reject(error);
            });
        };

        fnFetch([...dumps]);
      })
    ))
);

export default fetchImages;
