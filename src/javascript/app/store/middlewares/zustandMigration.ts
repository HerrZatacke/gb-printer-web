import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import useFiltersStore, { ImageSelectionMode } from '../../stores/filtersStore';
import { Actions } from '../actions';
import type { DeleteImageAction, DeleteImagesAction, AddImagesAction } from '../../../../types/actions/ImageActions';


export const zustandMigrationMiddleware: MiddlewareWithState = () => (next) => (
  action:
    AddImagesAction |
    DeleteImageAction |
    DeleteImagesAction,
) => {
  switch (action.type) {
    case Actions.DELETE_IMAGE:
      useFiltersStore.getState().updateImageSelection(ImageSelectionMode.REMOVE, action.payload);
      break;
    case Actions.DELETE_IMAGES:
      useFiltersStore.getState().setImageSelection([]);
      break;
    case Actions.ADD_IMAGES:
      // ToDo: also update recentImports from GLOBAL_UPDATE
      useFiltersStore.getState().updateRecentImports(action.payload);
      break;
    default:
  }

  return next(action);
};
