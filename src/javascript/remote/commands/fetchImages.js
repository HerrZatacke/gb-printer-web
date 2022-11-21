import Queue from 'promise-queue/lib';
import fetchDumpRetry from '../fetchDumpRetry';

const queue = new Queue(1, Infinity);
const addToQueue = (fn, { delay = 250 }) => (
  queue.add(() => (
    new Promise((resolve, reject) => {
      window.setTimeout(() => {
        fn()
          .then(resolve)
          .catch(reject);
      }, delay);
    })
  ))
);

const fetchImages = (targetWindow, { dumps }, remoteParams) => (
  Promise.all(dumps.map((dump, index) => (
    addToQueue(
      () => fetchDumpRetry(`/${dump.replace(/^\//, '')}`, 3)
        .then(({ blob, contentType, status, ok, meta }) => {
          targetWindow.postMessage({
            fromRemotePrinter: {
              progress: (index + 1) / dumps.length,
            },
          }, '*');

          return { blob, contentType, status, ok, meta };
        })
        .catch((error) => {
          console.warn(error);
          return {
            blob: null,
            contentType: null,
            status: null,
            ok: false,
          };
        }),
      remoteParams,
    )
  )))
)
  .then((blobsdone) => ({ blobsdone }));

export default fetchImages;
