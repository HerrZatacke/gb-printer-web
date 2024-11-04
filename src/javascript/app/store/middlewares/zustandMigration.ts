import screenfull from 'screenfull';
import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import useFiltersStore, { ImageSelectionMode } from '../../stores/filtersStore';
import useInteractionsStore from '../../stores/interactionsStore';
import { Actions } from '../actions';
import type { DeleteImageAction, DeleteImagesAction, AddImagesAction, RehashImageAction } from '../../../../types/actions/ImageActions';
import type { AddFrameAction, DeleteFrameAction } from '../../../../types/actions/FrameActions';
import type { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import { checkUpdateTrashCount } from '../../../tools/checkUpdateTrashCount';
import type {
  ProgressExecutePluginAction,
  ProgressPrinterProgressAction,
} from '../../../../types/actions/ProgressActions';
import type { ConfirmAnsweredAction } from '../../../../types/actions/ConfirmActions';
import type { ImportQueueCancelAction } from '../../../../types/actions/QueueActions';
import type { StorageSyncStartAction } from '../../../../types/actions/LogActions';

export const zustandMigrationMiddleware: MiddlewareWithState = (store) => {
  const {
    updateImageSelection,
    setImageSelection,
    updateRecentImports,
  } = useFiltersStore.getState();

  const {
    setWindowDimensions,
    setLightboxImage,
    setLightboxImageNext,
    setLightboxImagePrev,
    setIsFullscreen,
    setProgress,
  } = useInteractionsStore.getState();

  checkUpdateTrashCount(store.getState());

  window.addEventListener('resize', setWindowDimensions);

  if (screenfull.isEnabled) {
    screenfull.on('change', () => {
      setIsFullscreen(!!screenfull.element);
    });
  }

  document.addEventListener('keydown', (ev) => {
    const { lightboxImage } = useInteractionsStore.getState();
    if (lightboxImage === null) {
      return;
    }

    switch (ev.key) {
      case 'Esc':
      case 'Escape':
        setLightboxImage(null);
        ev.preventDefault();
        break;

      case 'Right':
      case 'ArrowRight':
        setLightboxImageNext(store.getState().images.length);
        ev.preventDefault();
        break;

      case 'Left':
      case 'ArrowLeft':
        setLightboxImagePrev();
        ev.preventDefault();
        break;

      default:
        break;
    }
  });


  return (next) => (
    action:
      AddFrameAction |
      AddImagesAction |
      ConfirmAnsweredAction |
      DeleteFrameAction |
      DeleteImageAction |
      DeleteImagesAction |
      GlobalUpdateAction |
      ImportQueueCancelAction |
      ProgressExecutePluginAction |
      ProgressPrinterProgressAction |
      RehashImageAction |
      StorageSyncStartAction,
  ) => {
    switch (action.type) {
      case Actions.DELETE_IMAGE:
        updateImageSelection(ImageSelectionMode.REMOVE, action.payload);
        break;
      case Actions.DELETE_IMAGES:
        setImageSelection([]);
        break;
      case Actions.ADD_IMAGES:
        // ToDo: also update recentImports from GLOBAL_UPDATE
        updateRecentImports(action.payload);
        break;
      default:
    }

    // first delete object data, then do a localStorage cleanup
    next(action);

    switch (action.type) {
      case Actions.DELETE_IMAGE:
      case Actions.DELETE_IMAGES:
      case Actions.GLOBAL_UPDATE:
      case Actions.REHASH_IMAGE:
      case Actions.DELETE_FRAME:
      case Actions.ADD_FRAME:
        checkUpdateTrashCount(store.getState());
        break;

      case Actions.ADD_IMAGES:
        checkUpdateTrashCount(store.getState());
        setProgress('printer', 0);
        break;
      case Actions.EXECUTE_PLUGIN_PROGRESS:
        setProgress('plugin', action.payload);
        break;
      case Actions.PRINTER_PROGRESS:
        setProgress('printer', action.payload);
        break;
      case Actions.IMPORTQUEUE_CANCEL:
      case Actions.CONFIRM_ANSWERED:
        setProgress('printer', 0);
        break;

      default:
        break;
    }
  };
};
