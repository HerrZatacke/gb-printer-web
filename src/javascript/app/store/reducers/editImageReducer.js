/* eslint-disable default-param-last */
import { Actions } from '../actions';

const editImageReducer = (value = null, action) => {
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
