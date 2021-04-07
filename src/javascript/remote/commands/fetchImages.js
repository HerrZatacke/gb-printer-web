import Queue from 'promise-queue';

const queue = new Queue(1, Infinity);
const addToQueue = (fn) => (
  queue.add(() => (
    new Promise((resolve, reject) => {
      window.setTimeout(() => {
        fn()
          .then(resolve)
          .catch(reject);
      }, 250);
    })
  ))
);

const fetchImages = (targetWindow, { dumps }) => (
  Promise.all(dumps.map((dump, index) => (
    addToQueue(
      () => fetch(`/${dump.replace(/^\//, '')}`)
        .then((res) => res.blob())
        .then((blob) => {
          targetWindow.postMessage({
            fromRemotePrinter: {
              progress: (index + 1) / dumps.length,
            },
          }, '*');

          return blob;
        }),
    )
  )))
)
  .then((blobsdone) => ({ blobsdone }));

export default fetchImages;
