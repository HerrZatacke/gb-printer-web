import type { Actions } from '../../javascript/app/store/actions';
import type { ErrorMessage } from '../../javascript/app/components/Errors/useErrors';

export interface FramesMessageHideAction {
  type: Actions.FRAMES_MESSAGE_HIDE
}

export interface IsFullscreenAction {
  type: Actions.SET_IS_FULLSCREEN,
  payload?: boolean,
}

export interface SetLightboxImageAction {
  type: Actions.SET_LIGHTBOX_IMAGE_INDEX,
  payload?: number,
}

export interface SetLightboxPrevAction {
  type: Actions.LIGHTBOX_PREV,
}

export interface SetLightboxNextAction {
  type: Actions.LIGHTBOX_NEXT,
}

export interface SetLightboxFullscreenAction {
  type: Actions.LIGHTBOX_FULLSCREEN,
}

export interface ShowSerialsAction {
  type: Actions.SHOW_SERIALS,
  payload?: boolean,
}

export interface UseSerialsAction {
  type: Actions.USE_SERIALS,
  payload?: boolean,
}

export interface ErrorAction {
  type: Actions.ERROR,
  payload?: ErrorMessage,
}

export interface DismissErrorAction {
  type: Actions.DISMISS_ERROR,
  payload: number,
}
