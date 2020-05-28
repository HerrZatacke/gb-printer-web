const batch = (store) => (next) => (action) => {

  if (action.type === 'BATCH_TASK') {
    const { imageSelection } = store.getState();

    if (imageSelection.length) {
      switch (action.payload) {
        case 'delete':
          store.dispatch({
            type: 'DELETE_IMAGES',
            payload: imageSelection,
          });
          break;
        case 'download':
          // eslint-disable-next-line no-alert
          alert('Not yet...');
          break;
        case 'edit':
          // eslint-disable-next-line no-alert
          alert('Not yet...');
          break;
        default:
          break;
      }
    }
  }

  next(action);
};

export default batch;
