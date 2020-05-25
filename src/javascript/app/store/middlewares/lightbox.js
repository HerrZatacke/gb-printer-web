const confirmation = (store) => {

  document.addEventListener('keyup', (ev) => {

    switch (ev.key) {
      case 'Escape':
        store.dispatch({
          type: 'SET_LIGHTBOX_IMAGE_INDEX',
          payload: null,
        });
        break;

      case 'ArrowRight':
        store.dispatch({
          type: 'LIGHTBOX_NEXT',
        });
        break;

      case 'ArrowLeft':
        store.dispatch({
          type: 'LIGHTBOX_PREV',
        });
        break;

      default:
        break;
    }
  });

  return (next) => (action) => {
    const state = store.getState();

    switch (action.type) {
      case 'LIGHTBOX_NEXT':
        store.dispatch({
          type: 'SET_LIGHTBOX_IMAGE_INDEX',
          payload: Math.min(state.lightboxImage + 1, state.images.length - 1),
        });
        return;
      case 'LIGHTBOX_PREV':
        store.dispatch({
          type: 'SET_LIGHTBOX_IMAGE_INDEX',
          payload: Math.max(state.lightboxImage - 1, 0),
        });
        return;
      default:
        break;
    }

    next(action);
  };
};


export default confirmation;
