/* eslint-disable default-param-last */
import { Actions } from '../actions';
import type { CloseLightboxAction, LightboxImageSetAction } from '../../../../types/actions/LightboxActions';


const lightboxImageReducer = (
  value: string | null = null,
  action: LightboxImageSetAction | CloseLightboxAction,
): string | null => {
  switch (action.type) {
    case Actions.SET_LIGHTBOX_IMAGE_HASH:
      return action.payload;

    case Actions.CLOSE_LIGHTBOX:
      return null;

    default:
      return value;
  }
};

export default lightboxImageReducer;
