import screenfull from 'screenfull';

const confirmation = (store) => {

  screenfull.on('change', () => {
    store.dispatch({
      type: 'SET_IS_FULLSCREEN',
      payload: !!screenfull.element,
    });
  });

  document.addEventListener('keyup', (ev) => {
    switch (ev.key) {
      case 'Esc':
      case 'Escape':
        store.dispatch({
          type: 'SET_LIGHTBOX_IMAGE_INDEX',
          payload: null,
        });
        break;

      case 'Right':
      case 'ArrowRight':
        store.dispatch({
          type: 'LIGHTBOX_NEXT',
        });
        break;

      case 'Left':
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
        if (state.lightboxImage === null) {
          return;
        }

        store.dispatch({
          type: 'SET_LIGHTBOX_IMAGE_INDEX',
          payload: Math.min(state.lightboxImage + 1, state.images.length - 1),
        });
        return;
      case 'LIGHTBOX_PREV':
        if (state.lightboxImage === null) {
          return;
        }

        store.dispatch({
          type: 'SET_LIGHTBOX_IMAGE_INDEX',
          payload: Math.max(state.lightboxImage - 1, 0),
        });
        return;
      case 'LIGHTBOX_FULLSCREEN':
        if (!screenfull.element) {
          screenfull.request(document.querySelector('body'));
        } else {
          screenfull.exit();
        }

        break;
      case 'SET_LIGHTBOX_IMAGE_INDEX':
        if (!action.payload && screenfull.element) {
          screenfull.exit();
        }

        break;
      default:
        break;
    }

    next(action);
  };
};


export default confirmation;
