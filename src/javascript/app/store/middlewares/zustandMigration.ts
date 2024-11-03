import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import useFiltersStore, { ImageSelectionMode } from '../../stores/filtersStore';
import { Actions } from '../actions';
import type { DeleteImageAction, DeleteImagesAction, AddImagesAction } from '../../../../types/actions/ImageActions';
import useInteractionsStore from '../../stores/interactionsStore';


export const zustandMigrationMiddleware: MiddlewareWithState = () => {
  const { updateImageSelection, setImageSelection, updateRecentImports } = useFiltersStore.getState();
  const { setWindowDimensions } = useInteractionsStore.getState();
  window.addEventListener('resize', setWindowDimensions);

  return (next) => (
    action:
      AddImagesAction |
      DeleteImageAction |
      DeleteImagesAction,
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

    return next(action);
  };
};
