/* eslint-disable default-param-last */
import { Actions } from '../actions';
import type { SetLightboxImageAction } from '../../../../types/actions/GlobalActions';

const lightboxImageReducer = (value: number | null = null, action: SetLightboxImageAction): number | null => {
  switch (action.type) {
    case Actions.SET_LIGHTBOX_IMAGE_INDEX:
      return action.payload !== undefined ? action.payload : null;

    // on some filters reset this to null?
    default:
      return value;
  }
};

export default lightboxImageReducer;
