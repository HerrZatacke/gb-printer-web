import handleLines from '../../../tools/handleLines';

const plainText = (store) => (next) => (action) => {
  if (action.type === 'IMPORT_PLAIN_TEXT') {

    store.dispatch({
      type: 'CLEAR_LINES',
    });

    const lines = action.payload.split('\n')
      .map(handleLines)
      .filter(Boolean)
      .filter(({ type }) => (type === 'NEW_LINE'))
      // ToDo: check for multiple images in Dump
      .map(({ payload }) => payload)
      .filter(Boolean);

    store.dispatch({
      type: 'SET_ALL_LINES',
      payload: lines,
    });

    return;
  }

  next(action);
};


export default plainText;
