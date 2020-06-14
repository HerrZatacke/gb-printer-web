import getHandleFileImport from '../../../tools/getHandleFileImport';

const fileDrop = (store) => {
  const root = document.querySelector('#app');
  const handleFileDispatch = getHandleFileImport(store.dispatch);
  let dragoverTimeout;
  let dragging = false;

  // detect start and end of dragover as there is no native dragend ecent for files
  root.addEventListener('dragover', (ev) => {
    ev.preventDefault();

    if (!dragging) {
      store.dispatch({
        type: 'IMPORT_DRAGOVER_START',
      });
    }

    window.clearTimeout(dragoverTimeout);

    dragging = true;

    dragoverTimeout = window.setTimeout(() => {
      dragging = false;
      store.dispatch({
        type: 'IMPORT_DRAGOVER_END',
      });
    }, 250);
  });

  root.addEventListener('drop', (ev) => {
    ev.preventDefault();

    let files;

    if (ev.dataTransfer.items) {
      files = [...ev.dataTransfer.items]
        .filter(({ kind }) => kind === 'file')
        .map((item) => item.getAsFile());
    } else {
      files = [...ev.dataTransfer.files];
    }

    files.forEach(handleFileDispatch);
  });

  return (next) => (action) => {
    next(action);
  };
};

export default fileDrop;
