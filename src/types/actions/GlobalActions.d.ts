import type { Actions } from '../../javascript/app/store/actions';

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
