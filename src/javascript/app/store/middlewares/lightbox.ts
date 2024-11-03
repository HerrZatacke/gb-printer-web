import screenfull from 'screenfull';
import useFiltersStore from '../../stores/filtersStore';
import { getFilteredImages } from '../../../tools/getFilteredImages';
import { Actions } from '../actions';
import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import type {
  IsFullscreenAction,
  SetLightboxImageAction,
  SetLightboxNextAction,
  SetLightboxPrevAction,
} from '../../../../types/actions/GlobalActions';

const confirmation: MiddlewareWithState = (store) => {

  if (screenfull.isEnabled) {
    screenfull.on('change', () => {
      store.dispatch<IsFullscreenAction>({
        type: Actions.SET_IS_FULLSCREEN,
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
        store.dispatch<SetLightboxImageAction>({
          type: Actions.SET_LIGHTBOX_IMAGE_INDEX,
          // No payload means "close"
        });
        ev.preventDefault();
        break;

      case 'Right':
      case 'ArrowRight':
        store.dispatch<SetLightboxNextAction>({
          type: Actions.LIGHTBOX_NEXT,
        });
        ev.preventDefault();
        break;

      case 'Left':
      case 'ArrowLeft':
        store.dispatch<SetLightboxPrevAction>({
          type: Actions.LIGHTBOX_PREV,
        });
        ev.preventDefault();
        break;

      default:
        break;
    }
  });

  return (next) => (action) => {
    const state = store.getState();
    const filtersState = useFiltersStore.getState();

    switch (action.type) {
      case Actions.LIGHTBOX_NEXT:
        if (state.lightboxImage === null) {
          return;
        }

        store.dispatch<SetLightboxImageAction>({
          type: Actions.SET_LIGHTBOX_IMAGE_INDEX,
          payload: Math.min(state.lightboxImage + 1, state.images.length - 1),
        });
        return;
      case Actions.LIGHTBOX_PREV:
        if (state.lightboxImage === null) {
          return;
        }

        store.dispatch<SetLightboxImageAction>({
          type: Actions.SET_LIGHTBOX_IMAGE_INDEX,
          payload: Math.max(state.lightboxImage - 1, 0),
        });
        return;
      case Actions.LIGHTBOX_FULLSCREEN:
        if (screenfull.isEnabled) {
          if (!screenfull.element) {
            screenfull.request(document.body);
          } else {
            screenfull.exit();
          }
        }

        break;
      case Actions.SET_LIGHTBOX_IMAGE_INDEX:
        if (screenfull.isEnabled && !action.payload && screenfull.element) {
          screenfull.exit();
        }

        break;

      case Actions.SET_LIGHTBOX_IMAGE_HASH:
        store.dispatch<SetLightboxImageAction>({
          type: Actions.SET_LIGHTBOX_IMAGE_INDEX,
          payload: getFilteredImages(state.images, filtersState).findIndex(({ hash }) => hash === action.payload),
        });

        break;
      default:
        break;
    }

    next(action);
  };
};


export default confirmation;
