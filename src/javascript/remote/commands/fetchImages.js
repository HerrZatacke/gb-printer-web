import Queue from 'promise-queue';

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
      () => fetch(`/${dump.replace(/^\//, '')}`)
        .then((res) => (
          res.blob()
            .then((blob) => {
              const contentType = res.headers.get('content-type');

              targetWindow.postMessage({
                fromRemotePrinter: {
                  progress: (index + 1) / dumps.length,
                },
              }, '*');

              return {
                blob,
                contentType,
                status: res.status,
                ok: res.ok,
              };
            })
        )),
      remoteParams,
    )
  )))
)
  .then((blobsdone) => ({ blobsdone }));

export default fetchImages;
