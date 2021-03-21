const dispatchDeleteImageConfirmation = (action, dispatch, images) => {
  let message;

  if (typeof action.payload === 'string') {
    const image = images.find(({ hash }) => hash === action.payload);
    message = image.title ? `Delete image "${image.title}"?` : 'Delete this image?';
  } else if (action.payload.length === 1) {
    const image = images.find(({ hash }) => hash === action.payload[0]);
    message = image.title ? `Delete image "${image.title}"?` : 'Delete this image?';
  } else {
    message = `Delete ${action.payload.length} images?`;
  }

  dispatch({
    type: 'SET_CONFIRMATION',
    payload: {
      message,
      originalAction: { confirmed: true, ...action },
    },
  });
};

const confirmation = (store) => {

  document.addEventListener('keydown', (ev) => {
    if ((ev.key === 'Escape') || (ev.key === 'Esc')) {
      const state = store.getState();

      store.dispatch({
        type: 'CLOSE_OVERLAY',
      });

      if (state.confirmation) {
        ev.preventDefault();
      }
    }
  });

  return (next) => (action) => {
    const state = store.getState();

    switch (action.type) {
      case 'DELETE_IMAGE':
      case 'DELETE_IMAGES':
        if (action.confirmed) {
          next(action);
          return;
        }

        dispatchDeleteImageConfirmation(action, store.dispatch, state.images);
        return;
      case 'CONFIRM_CONFIRMATION':
        store.dispatch({
          type: 'CLEAR_CONFIRMATION',
        });
        store.dispatch(state.confirmation.originalAction);
        return;
      case 'DENY_CONFIRMATION':
        store.dispatch({
          type: 'CLEAR_CONFIRMATION',
        });
        return;
      default:
    }

    next(action);
  };
};


export default confirmation;
