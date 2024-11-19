import screenfull from 'screenfull';
import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import useDialogsStore from '../../stores/dialogsStore';
import useEditStore from '../../stores/editStore';
import useFiltersStore, { ImageSelectionMode } from '../../stores/filtersStore';
import useImportsStore from '../../stores/importsStore';
import useInteractionsStore from '../../stores/interactionsStore';
import useItemsStore from '../../stores/itemsStore';
import useStoragesStore from '../../stores/storagesStore';
import { Actions } from '../actions';
import type {
  DeleteImageAction,
  DeleteImagesAction,
  AddImagesAction,
  RehashImageAction,
  ImageFavouriteAction,
  ImagesUpdateAction,
  SaveNewRGBImagesAction,
  ImagesBatchUpdateAction,
} from '../../../../types/actions/ImageActions';
import type { AddFrameAction } from '../../../../types/actions/FrameActions';
import type { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import { checkUpdateTrashCount } from '../../../tools/checkUpdateTrashCount';
import type { ImportQueueCancelAction } from '../../../../types/actions/QueueActions';
import type { PrinterRemoteCallAction } from '../../../../types/actions/PrinterActions';
import { dropboxStorageTool } from '../../../tools/dropboxStorage';
import { gitStorageTool } from '../../../tools/gitStorage';

export const zustandMigrationMiddleware: MiddlewareWithState = (store) => {
  const { dismissDialog } = useDialogsStore.getState();

  const {
    cancelEditFrame,
    cancelEditImages,
    cancelEditPalette,
    cancelEditRGBNImages,
  } = useEditStore.getState();

  const {
    updateImageSelection,
    setImageSelection,
    updateRecentImports,
  } = useFiltersStore.getState();

  const {
    frameQueueCancelOne,
    importQueueCancel,
    importQueueCancelOne,
  } = useImportsStore.getState();

  const {
    setWindowDimensions,
    setLightboxImage,
    setLightboxImageNext,
    setLightboxImagePrev,
    setIsFullscreen,
    setProgress,
    setPrinterBusy,
  } = useInteractionsStore.getState();

  const {
    setSyncLastUpdate,
  } = useStoragesStore.getState();

  const {
    addPalettes,
    addFrames,
    updateFrameGroups,
  } = useItemsStore.getState();

  checkUpdateTrashCount(store.getState().images, useItemsStore.getState().frames);

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

  dropboxStorageTool(store);
  gitStorageTool(store);

  return (next) => (
    action:
      AddFrameAction |
      AddImagesAction |
      DeleteImageAction |
      DeleteImagesAction |
      GlobalUpdateAction |
      ImagesBatchUpdateAction |
      ImageFavouriteAction |
      ImagesUpdateAction |
      ImportQueueCancelAction |
      PrinterRemoteCallAction |
      RehashImageAction |
      SaveNewRGBImagesAction,
  ) => {
    switch (action.type) {
      case Actions.DELETE_IMAGE:
        updateImageSelection(ImageSelectionMode.REMOVE, action.payload);
        break;
      case Actions.DELETE_IMAGES:
        setImageSelection([]);
        break;
      case Actions.ADD_IMAGES:
        updateRecentImports(action.payload);
        break;
      default:
    }

    // first delete object data, then do a localStorage cleanup
    next(action);

    switch (action.type) {
      case Actions.GLOBAL_UPDATE:
        checkUpdateTrashCount(store.getState().images, useItemsStore.getState().frames);
        cancelEditFrame();
        cancelEditPalette();
        cancelEditImages();
        setSyncLastUpdate('local', Math.floor((new Date()).getTime() / 1000));

        if (action.payload?.palettes) {
          addPalettes(action.payload.palettes);
        }

        if (action.payload?.images) {
          updateRecentImports(action.payload.images);
        }

        if (action.payload?.frames) {
          addFrames(action.payload.frames);
        }

        if (action.payload?.frameGroups) {
          updateFrameGroups(action.payload.frameGroups);
        }

        break;

      case Actions.REHASH_IMAGE:
        checkUpdateTrashCount(store.getState().images, useItemsStore.getState().frames);
        cancelEditImages();
        break;

      case Actions.DELETE_IMAGE:
      case Actions.DELETE_IMAGES:
      case Actions.ADD_FRAME:
        checkUpdateTrashCount(store.getState().images, useItemsStore.getState().frames);
        break;

      case Actions.ADD_IMAGES:
        checkUpdateTrashCount(store.getState().images, useItemsStore.getState().frames);
        setProgress('printer', 0);
        setPrinterBusy(false);
        importQueueCancel();
        break;

      case Actions.IMPORTQUEUE_CANCEL:
        setProgress('printer', 0);
        setPrinterBusy(false);
        importQueueCancel();
        break;

      case Actions.SAVE_NEW_RGB_IMAGES:
        cancelEditRGBNImages();
        break;
      case Actions.UPDATE_IMAGES_BATCH_CHANGES:
        cancelEditImages();
        break;


      default:
        break;
    }

    switch (action.type) {
      case Actions.ADD_FRAME:
        if (action.payload?.tempId) {
          importQueueCancelOne(action.payload.tempId);
          frameQueueCancelOne(action.payload.tempId);
        }

        if (action.payload?.frame) {
          addFrames([action.payload.frame]);
        }

        break;
      default:
        break;
    }

    switch (action.type) {
      case Actions.ADD_FRAME:
      case Actions.ADD_IMAGES:
      case Actions.DELETE_IMAGE:
      case Actions.DELETE_IMAGES:
        dismissDialog(0);
        break;

      default:
        break;
    }

    switch (action.type) {

      // ToDo: check for more action types which cause syncable data to be updated
      case Actions.REHASH_IMAGE:
      case Actions.UPDATE_IMAGES:
      case Actions.DELETE_IMAGE:
      case Actions.DELETE_IMAGES:
      case Actions.ADD_IMAGES:
      case Actions.ADD_FRAME:
      case Actions.IMAGE_FAVOURITE_TAG:
        setSyncLastUpdate('local', Math.floor((new Date()).getTime() / 1000));
        break;

      default:
        break;
    }
  };
};
