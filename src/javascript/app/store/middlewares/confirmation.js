const confirmation = (store) => {

  document.addEventListener('keydown', (ev) => {
    if ((ev.key === 'Escape') || (ev.key === 'Esc')) {
      store.dispatch({
        type: 'CLOSE_OVERLAY',
      });
      ev.preventDefault();
    }
  });

  return (next) => (action) => {
    const state = store.getState();

    switch (action.type) {
      case 'DELETE_IMAGE':
        if (action.confirmed) {
          next(action);
          return;
        }

        store.dispatch({
          type: 'SET_CONFIRMATION',
          payload: {
            message: 'Delete the image?',
            originalAction: { confirmed: true, ...action },
          },
        });
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
