/* eslint-disable default-param-last */
import { Actions } from '../actions';

const lastSelectedImageReducer = (value = null, action) => {
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
