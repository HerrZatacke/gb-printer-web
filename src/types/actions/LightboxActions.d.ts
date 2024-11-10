import type { Actions } from '../../javascript/app/store/actions';

export interface LightboxImageSetAction {
  type: Actions.SET_LIGHTBOX_IMAGE_HASH,
  payload: string,
}

export interface CloseLightboxAction {
  type: Actions.CLOSE_LIGHTBOX,
}
