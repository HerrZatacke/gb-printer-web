import dayjs from 'dayjs';
import { save } from '../../../tools/storage';

const saveLineBuffer = (store) => (next) => (action) => {

  const state = store.getState();

  if (
    (action.type === 'IMAGE_COMPLETE') ||
    (action.type === 'SET_ALL_LINES')
  ) {
    const dataHash = save(action.payload || state.lineBuffer);

    const image = {
      hash: dataHash,
      created: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      title: `Created at ${dayjs().format('DD.MM.YYYY HH:mm')}`,
      lines: state.lineBuffer.length,
      palette: state.activePalette,
    };

    store.dispatch({
      type: 'ADD_IMAGE',
      payload: image,
    });

    // console.log(load(dataHash));
  }

  next(action);
};

export default saveLineBuffer;
