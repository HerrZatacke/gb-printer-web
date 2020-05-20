import dayjs from 'dayjs';
import { save } from '../../../tools/storage';
import { dateFormat } from '../../../tools/values';

const saveLineBuffer = (store) => (next) => (action) => {

  const state = store.getState();

  if (
    (action.type === 'IMAGE_COMPLETE') ||
    (action.type === 'SET_ALL_LINES')
  ) {

    save(action.payload.lines || state.lineBuffer)
      .then((dataHash) => {
        const image = {
          hash: dataHash,
          created: dayjs().format(dateFormat),
          title: action.payload.file || '',
          index: state.globalIndex,
          lines: state.lineBuffer.length,
          palette: state.activePalette,
        };

        store.dispatch({
          type: 'ADD_IMAGE',
          payload: image,
        });
      });
  }

  next(action);
};

export default saveLineBuffer;
