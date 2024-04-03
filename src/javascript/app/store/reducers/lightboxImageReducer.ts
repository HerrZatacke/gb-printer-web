/* eslint-disable default-param-last */
import { Actions } from '../actions';

interface LightboxImageAction {
  type: Actions.SET_LIGHTBOX_IMAGE_INDEX,
  payload: number,
}

const lightboxImageReducer = (value: number | null = null, action: LightboxImageAction): number | null => {
  switch (action.type) {
    case Actions.SET_LIGHTBOX_IMAGE_INDEX:
      return action.payload;

    // on some filters reset this to null?
    default:
      return value;
  }
};

export default lightboxImageReducer;
