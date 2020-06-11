let silenceTimeout = null;
const hideLiveImage = (store) => (next) => (action) => {


  if (['NEW_LINES', 'SET_ALL_LINES'].includes(action.type)) {
    window.clearTimeout(silenceTimeout);

    // Let the live-image disappear after a few seconds
    silenceTimeout = window.setTimeout(() => {
      store.dispatch({
        type: 'CLEAR_LINES',
      });
    }, 5000);
  }


  next(action);
};

export default hideLiveImage;
