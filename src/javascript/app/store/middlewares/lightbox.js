import screenfull from 'screenfull';
import getFilteredImages from '../../../tools/getFilteredImages';
import {
  LIGHTBOX_FULLSCREEN,
  LIGHTBOX_NEXT,
  LIGHTBOX_PREV,
  SET_IS_FULLSCREEN,
  SET_LIGHTBOX_IMAGE_HASH,
  SET_LIGHTBOX_IMAGE_INDEX,
  WINDOW_DIMENSIONS,
} from '../actions';

const confirmation = (store) => {

  window.addEventListener('resize', () => {
    store.dispatch({
      type: WINDOW_DIMENSIONS,
      payload: {
        height: window.innerHeight,
        width: window.innerWidth,
      },
    });
  });

  if (screenfull.isEnabled) {
    screenfull.on('change', () => {
      store.dispatch({
        type: SET_IS_FULLSCREEN,
        payload: !!screenfull.element,
      });
    });
  }

  document.addEventListener('keydown', (ev) => {
    const state = store.getState();
    if (state.lightboxImage === null) {
      return;
    }

    switch (ev.key) {
      case 'Esc':
      case 'Escape':
        store.dispatch({
          type: SET_LIGHTBOX_IMAGE_INDEX,
          payload: null,
        });
        ev.preventDefault();
        break;

      case 'Right':
      case 'ArrowRight':
        store.dispatch({
          type: LIGHTBOX_NEXT,
        });
        ev.preventDefault();
        break;

      case 'Left':
      case 'ArrowLeft':
        store.dispatch({
          type: LIGHTBOX_PREV,
        });
        ev.preventDefault();
        break;

      default:
        break;
    }
  });

  return (next) => (action) => {
    const state = store.getState();

    switch (action.type) {
      case LIGHTBOX_NEXT:
        if (state.lightboxImage === null) {
          return;
        }

        store.dispatch({
          type: SET_LIGHTBOX_IMAGE_INDEX,
          payload: Math.min(state.lightboxImage + 1, state.images.length - 1),
        });
        return;
      case LIGHTBOX_PREV:
        if (state.lightboxImage === null) {
          return;
        }

        store.dispatch({
          type: SET_LIGHTBOX_IMAGE_INDEX,
          payload: Math.max(state.lightboxImage - 1, 0),
        });
        return;
      case LIGHTBOX_FULLSCREEN:
        if (screenfull.isEnabled) {
          if (!screenfull.element) {
            screenfull.request(document.querySelector('body'));
          } else {
            screenfull.exit();
          }
        }

        break;
      case SET_LIGHTBOX_IMAGE_INDEX:
        if (screenfull.isEnabled && !action.payload && screenfull.element) {
          screenfull.exit();
        }

        break;

      case SET_LIGHTBOX_IMAGE_HASH:
        store.dispatch({
          type: SET_LIGHTBOX_IMAGE_INDEX,
          payload: getFilteredImages(state).findIndex(({ hash }) => hash === action.payload),
        });

        break;
      default:
        break;
    }

    next(action);
  };
};


export default confirmation;
