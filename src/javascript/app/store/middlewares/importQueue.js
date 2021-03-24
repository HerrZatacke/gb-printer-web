import saveNewImage from '../../../tools/saveNewImage';

const importQueue = (store) => {

  const images = [];
  let queueRunning;

  const startQueue = () => {
    if (queueRunning || !images.length) {
      return;
    }

    queueRunning = true;

    window.setTimeout(() => {
      queueRunning = false;
      const image = images.shift();

      saveNewImage({
        lines: image.lines,
        filename: image.file,
        palette: store.getState().activePalette,
        dispatch: store.dispatch,
      });
    }, 50);

    store.dispatch({
      type: 'IMPORT_QUEUE_SIZE',
      payload: images.length - 1,
    });
  };

  return (next) => (action) => {

    if (action.type === 'ADD_TO_QUEUE') {
      images.push(...action.payload);
      startQueue();
      return;
    }

    next(action);

    if (action.type === 'ADD_IMAGE') {
      startQueue();
    }
  };
};

export default importQueue;
