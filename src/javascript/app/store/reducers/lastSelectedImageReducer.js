import {
  DELETE_IMAGE,
  DELETE_IMAGES,
  IMAGE_SELECTION_ADD,
  IMAGE_SELECTION_REMOVE,
  SET_CURRENT_GALLERY_VIEW,
} from '../actions';

const lastSelectedImageReducer = (value = null, action) => {
  switch (action.type) {
    case IMAGE_SELECTION_ADD:
    case IMAGE_SELECTION_REMOVE:
      return action.payload;
    case DELETE_IMAGE:
    case DELETE_IMAGES:
    case SET_CURRENT_GALLERY_VIEW:
      return null;
    default:
      return value;
  }
};

export default lastSelectedImageReducer;
