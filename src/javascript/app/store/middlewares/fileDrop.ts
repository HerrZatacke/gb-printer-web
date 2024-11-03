import dayjs from 'dayjs';
import getHandleFileImport from '../../../tools/getHandleFileImport';
import { Actions } from '../actions';
import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import type { ErrorAction } from '../../../../types/actions/GlobalActions';
import useInteractionsStore from '../../stores/interactionsStore';

const fileDrop: MiddlewareWithState = (store) => {
  const root = document.querySelector('#app');
  if (!root) {
    throw new Error('dafuq?');
  }

  const { setDragover } = useInteractionsStore.getState();

  const handleFileImport = getHandleFileImport(store);
  let dragoverTimeout: number;
  let dragging = false;

  // detect start and end of dragover as there is no native dragend ecent for files
  root.addEventListener('dragover', (ev) => {
    ev.preventDefault();

    if (!dragging) {
      setDragover(true);
    }

    window.clearTimeout(dragoverTimeout);

    dragging = true;

    dragoverTimeout = window.setTimeout(() => {
      dragging = false;
      setDragover(false);
    }, 250);
  });

  root.addEventListener('drop', async (ev: Event) => {
    ev.preventDefault();
    let files: File[];
    const items = ((ev as DragEvent).dataTransfer as DataTransfer).items as DataTransferItemList;

    if (items) {
      files = ([...items] as DataTransferItem[])
        .reduce((acc: File[], item: DataTransferItem): File[] => {
          if (item.kind === 'file') {
            const file = item.getAsFile();
            return file ? [...acc, file] : acc;
          }

          return acc;
        }, []);
    } else {
      const fileList = ((ev as DragEvent).dataTransfer as DataTransfer).files as FileList;
      files = [...fileList];
    }

    try {
      await handleFileImport(files);
    } catch (error) {
      store.dispatch<ErrorAction>({
        type: Actions.ERROR,
        payload: {
          error: error as Error,
          timestamp: dayjs().unix(),
        },
      });
    }
  });

  return (next) => (action) => {
    next(action);
  };
};

export default fileDrop;
