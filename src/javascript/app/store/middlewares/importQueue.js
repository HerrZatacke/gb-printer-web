import Queue from 'promise-queue';
import saveNewImage from '../../../tools/saveNewImage';
import uniqueBy from '../../../tools/unique/by';

const importQueue = (store) => {

  const uniqueHash = uniqueBy('hash');
  const queue = new Queue(1, Infinity);

  const addToQueue = (images) => {

    Promise.all(images.map((image) => (
      queue.add(() => (
        saveNewImage({
          lines: image.lines,
          filename: image.file,
          palette: store.getState().activePalette,
          dispatch: store.dispatch,
        })
      ))
    )))
      .then((result) => {

        const uniqueResult = uniqueHash(result);
        const duplicatesMsg = uniqueResult.length === result.length ? '' :
          ` (${result.length - uniqueResult.length} duplicates found in import)`;

        store.dispatch({
          type: 'CONFIRM_ASK',
          payload: {
            message: `Import ${uniqueResult.length} images? ${duplicatesMsg}`,
            confirm: () => {
              store.dispatch({
                type: 'ADD_IMAGES',
                payload: uniqueResult,
              });
            },
            deny: () => {
              store.dispatch({
                type: 'CONFIRM_ANSWERED',
              });
            },
          },
        });
      });
  };


  // const images = [];
  // let queueRunning;
  //
  // const startQueue = () => {
  //   if (queueRunning || !images.length) {
  //     return;
  //   }
  //
  //   queueRunning = true;
  //
  //   window.setTimeout(() => {
  //     queueRunning = false;
  //     const image = images.shift();
  //
  //     saveNewImage({
  //       lines: image.lines,
  //       filename: image.file,
  //       palette: store.getState().activePalette,
  //       dispatch: store.dispatch,
  //     });
  //   }, 50);
  //
  //   store.dispatch({
  //     type: 'IMPORT_QUEUE_SIZE',
  //     payload: images.length - 1,
  //   });
  // };

  return (next) => (action) => {

    if (action.type === 'ADD_TO_QUEUE') {
      addToQueue(action.payload);
      return;
    }

    next(action);
  };
};

export default importQueue;
