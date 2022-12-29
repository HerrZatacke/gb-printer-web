import Queue from 'promise-queue/lib';
import saveNewImage from '../../../tools/saveNewImage';
import uniqueBy from '../../../tools/unique/by';
import { ADD_IMAGES, ADD_TO_QUEUE, CONFIRM_ANSWERED, CONFIRM_ASK } from '../actions';
import padToHeight from '../../../tools/padToHeight';

const importQueue = (store) => {

  const uniqueHash = uniqueBy('hash');
  const queue = new Queue(1, Infinity);

  const addToQueue = (images) => {

    const { importPad } = store.getState();

    Promise.all(images.map((image) => (
      queue.add(() => (
        saveNewImage({
          lines: importPad ? padToHeight(image.lines) : image.lines,
          filename: image.file,
          palette: store.getState().activePalette,
        })
      ))
    )))
      .then((result) => {
        const uniqueResult = uniqueHash(result);
        const duplicatesMsg = uniqueResult.length === result.length ? '' :
          ` (${result.length - uniqueResult.length} duplicates found in import)`;

        store.dispatch({
          type: CONFIRM_ASK,
          payload: {
            message: `Import ${uniqueResult.length} images?${duplicatesMsg}`,
            confirm: () => {
              store.dispatch({
                type: ADD_IMAGES,
                payload: uniqueResult,
              });
            },
            deny: () => {
              store.dispatch({
                type: CONFIRM_ANSWERED,
              });
            },
          },
        });
      });
  };

  return (next) => (action) => {

    if (action.type === ADD_TO_QUEUE) {
      addToQueue(action.payload);
      return;
    }

    next(action);
  };
};

export default importQueue;
