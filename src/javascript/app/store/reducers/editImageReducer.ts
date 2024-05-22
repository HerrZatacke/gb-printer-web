/* eslint-disable default-param-last */
import { Actions } from '../actions';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import { CurrentEditBatch } from '../../../../types/Image';
import {
  CancelEditImagesAction,
  EditImageSelectionAction,
  ImagesBatchUpdateAction,
  RehashImageAction,
  UpdateImageAction,
} from '../../../../types/actions/ImageActions';

const editImageReducer = (
  value: CurrentEditBatch | null = null,
  action:
    EditImageSelectionAction |
    CancelEditImagesAction |
    UpdateImageAction |
    RehashImageAction |
    ImagesBatchUpdateAction |
    GlobalUpdateAction,
): CurrentEditBatch | null => {
  switch (action.type) {
    case Actions.EDIT_IMAGE_SELECTION:
      return action.payload;
    case Actions.CANCEL_EDIT_IMAGES:
    case Actions.UPDATE_IMAGE:
    case Actions.REHASH_IMAGE:
    case Actions.UPDATE_IMAGES_BATCH:
    case Actions.GLOBAL_UPDATE:
      return null;
    default:
      return value;
  }
};

export default editImageReducer;
