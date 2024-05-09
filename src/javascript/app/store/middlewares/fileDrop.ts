import getHandleFileImport from '../../../tools/getHandleFileImport';
import { Actions } from '../actions';
import { MiddlewareWithState } from '../../../../types/MiddlewareWithState';

const fileDrop: MiddlewareWithState = (store) => {
  const root = document.querySelector('#app');
  if (!root) {
    throw new Error('dafuq?');
  }

  const handleFileImport = getHandleFileImport(store);
  let dragoverTimeout: number;
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

  root.addEventListener('drop', async (ev: Event) => {
    ev.preventDefault();
    let files;
    const items = ((ev as DragEvent).dataTransfer as DataTransfer).items as DataTransferItemList;

    if (items) {
      files = [...items]
        .filter(({ kind }) => kind === 'file')
        .map((item) => item.getAsFile());
    } else {
      const fileList = ((ev as DragEvent).dataTransfer as DataTransfer).files as FileList;
      files = [...fileList];
    }

    try {
      await handleFileImport(files as File[]);
    } catch (error) {
      store.dispatch({
        type: Actions.ERROR,
        payload: (error as Error).message,
      });
    }
  });

  return (next) => (action) => {
    next(action);
  };
};

export default fileDrop;
