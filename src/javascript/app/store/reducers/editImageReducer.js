import {
  CANCEL_EDIT_IMAGE,
  EDIT_IMAGE,
  EDIT_IMAGE_SELECTION,
  GLOBAL_UPDATE,
  REHASH_IMAGE,
  UPDATE_IMAGE,
  UPDATE_IMAGES_BATCH,
} from '../actions';

const editImageReducer = (value = null, action) => {
  switch (action.type) {
    case EDIT_IMAGE:
      return { hash: action.payload };
    case EDIT_IMAGE_SELECTION:
      return action.payload;
    case CANCEL_EDIT_IMAGE:
    case UPDATE_IMAGE:
    case REHASH_IMAGE:
    case UPDATE_IMAGES_BATCH:
    case GLOBAL_UPDATE:
      return null;
    default:
      return value;
  }
};

export default editImageReducer;
