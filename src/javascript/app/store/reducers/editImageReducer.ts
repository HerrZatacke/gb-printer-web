/* eslint-disable default-param-last */
import { Actions } from '../actions';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import { CurrentEditBatch, CurrentEditSingleImage } from '../../../../types/Image';
import {
  CancelEditImageAction,
  EditImageAction,
  EditImageSelectionAction,
  ImagesBatchUpdateAction,
  RehashImageAction,
  UpdateImageAction,
} from '../../../../types/actions/ImageActions';

const editImageReducer = (
  value: CurrentEditSingleImage | null = null,
  action:
    EditImageAction |
    EditImageSelectionAction |
    CancelEditImageAction |
    UpdateImageAction |
    RehashImageAction |
    ImagesBatchUpdateAction |
    GlobalUpdateAction,
): CurrentEditSingleImage | CurrentEditBatch | null => {
  switch (action.type) {
    case Actions.EDIT_IMAGE:
      return { hash: action.payload };
    case Actions.EDIT_IMAGE_SELECTION:
      return action.payload;
    case Actions.CANCEL_EDIT_IMAGE:
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
