import type { Actions } from '../../javascript/app/store/actions';
import type { ErrorMessage } from '../../javascript/app/components/Errors/useErrors';

export interface EnableImageGroupsAction {
  type: Actions.SET_ENABLE_IMAGE_GROUPS,
  payload: boolean,
}

export interface FramesMessageHideAction {
  type: Actions.FRAMES_MESSAGE_HIDE
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
