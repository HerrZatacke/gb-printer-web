/* eslint-disable default-param-last */
import { Actions } from '../actions';
import type { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import type { CurrentEditBatch } from '../../../../types/Image';
import type {
  CancelEditImagesAction,
  EditImageSelectionAction,
  ImagesBatchUpdateAction,
  RehashImageAction,
} from '../../../../types/actions/ImageActions';

const editImageReducer = (
  value: CurrentEditBatch | null = null,
  action:
    EditImageSelectionAction |
    CancelEditImagesAction |
    RehashImageAction |
    ImagesBatchUpdateAction |
    GlobalUpdateAction,
): CurrentEditBatch | null => {
  switch (action.type) {
    case Actions.EDIT_IMAGE_SELECTION:
      return action.payload;
    case Actions.CANCEL_EDIT_IMAGES:
    case Actions.REHASH_IMAGE:
    case Actions.UPDATE_IMAGES_BATCH_CHANGES:
    case Actions.GLOBAL_UPDATE:
      return null;
    default:
      return value;
  }
};

export default editImageReducer;
