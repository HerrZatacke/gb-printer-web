import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import useFiltersStore, { ImageSelectionMode } from '../../stores/filtersStore';
import { Actions } from '../actions';
import type { DeleteImageAction, DeleteImagesAction } from '../../../../types/actions/ImageActions';
import type { GalleryViewAction } from '../../../../types/actions/GalleryViewAction';

export const zustandMigrationMiddleware: MiddlewareWithState = () => (next) => (
  action:
    DeleteImageAction |
    DeleteImagesAction |
    GalleryViewAction,
) => {
  switch (action.type) {
    case Actions.DELETE_IMAGE:
      useFiltersStore.getState().updateImageSelection(ImageSelectionMode.REMOVE, action.payload);
      break;
    case Actions.DELETE_IMAGES:
    case Actions.SET_CURRENT_GALLERY_VIEW:
      useFiltersStore.getState().setImageSelection([]);
      break;

      // ToDo: also update recentImports from GLOBAL_UPDATE
    default:
  }

  return next(action);
};
