/* eslint-disable default-param-last */
import { Actions } from '../actions';

const lightboxImageReducer = (value = null, action) => {
  switch (action.type) {
    case Actions.SET_LIGHTBOX_IMAGE_INDEX:
      return action.payload;

    // on some filters reset this to null?
    default:
      return value;
  }
};

export default lightboxImageReducer;
