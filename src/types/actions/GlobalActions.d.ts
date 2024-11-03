import type { Actions } from '../../javascript/app/store/actions';

export interface FramesMessageHideAction {
  type: Actions.FRAMES_MESSAGE_HIDE
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
