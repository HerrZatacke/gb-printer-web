/* eslint-disable default-param-last */
import { Actions } from '../actions';

interface CurrentEditSingleImage {
  hash: string,
}

interface CurrentEditBatch {
  hash: string,
  batch: string[],
  tags: string[],
}

type EditImageAction = {
  type: Actions.EDIT_IMAGE
  payload: string,
} | {
  type: Actions.EDIT_IMAGE_SELECTION,
  payload: CurrentEditBatch,
} | {
  type:
    Actions.CANCEL_EDIT_IMAGE |
    Actions.UPDATE_IMAGE |
    Actions.REHASH_IMAGE |
    Actions.UPDATE_IMAGES_BATCH |
    Actions.GLOBAL_UPDATE,
}

const editImageReducer = (
  value: CurrentEditSingleImage | null = null,
  action: EditImageAction,
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
