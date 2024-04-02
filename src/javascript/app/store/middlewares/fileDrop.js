import getHandleFileImport from '../../../tools/getHandleFileImport';
import { Actions } from '../actions';

const fileDrop = (store) => {
  const root = document.querySelector('#app');
  const handleFileImport = getHandleFileImport(store);
  let dragoverTimeout;
  let dragging = false;

  // detect start and end of dragover as there is no native dragend ecent for files
  root.addEventListener('dragover', (ev) => {
    ev.preventDefault();

    if (!dragging) {
      store.dispatch({
        type: Actions.IMPORT_DRAGOVER_START,
      });
    }

    window.clearTimeout(dragoverTimeout);

    dragging = true;

    dragoverTimeout = window.setTimeout(() => {
      dragging = false;
      store.dispatch({
        type: Actions.IMPORT_DRAGOVER_END,
      });
    }, 250);
  });

  root.addEventListener('drop', async (ev) => {
    ev.preventDefault();

    let files;

    if (ev.dataTransfer.items) {
      files = [...ev.dataTransfer.items]
        .filter(({ kind }) => kind === 'file')
        .map((item) => item.getAsFile());
    } else {
      files = [...ev.dataTransfer.files];
    }

    try {
      await handleFileImport(files);
    } catch (error) {
      store.dispatch({
        type: Actions.ERROR,
        payload: error.message,
      });
    }
  });

  return (next) => (action) => {
    next(action);
  };
};

export default fileDrop;
