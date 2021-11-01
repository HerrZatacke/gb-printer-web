import { SET_LIGHTBOX_IMAGE_INDEX } from '../actions';

const lightboxImageReducer = (value = null, action) => {
  switch (action.type) {
    case SET_LIGHTBOX_IMAGE_INDEX:
      return action.payload;

    // on some filters reset this to null?
    default:
      return value;
  }
};

export default lightboxImageReducer;
