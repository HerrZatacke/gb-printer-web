/* eslint-disable default-param-last */
import { Actions } from '../actions';
import type { ImageSelectionAddAction, ImageSelectionRemoveAction } from '../../../../types/actions/ImageSelectionActions';
import type { DeleteImageAction, DeleteImagesAction } from '../../../../types/actions/ImageActions';
import type { GalleryViewAction } from '../../../../types/actions/GalleryViewAction';

const lastSelectedImageReducer = (
  value: string | null = null,
  action:
    DeleteImageAction |
    DeleteImagesAction |
    ImageSelectionAddAction |
    ImageSelectionRemoveAction |
    GalleryViewAction,
): string | null => {
  switch (action.type) {
    case Actions.IMAGE_SELECTION_ADD:
    case Actions.IMAGE_SELECTION_REMOVE:
      return action.payload;
    case Actions.DELETE_IMAGE:
    case Actions.DELETE_IMAGES:
    case Actions.SET_CURRENT_GALLERY_VIEW:
      return null;
    default:
      return value;
  }
};

export default lastSelectedImageReducer;
