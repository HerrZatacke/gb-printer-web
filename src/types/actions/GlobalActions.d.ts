import type { Actions } from '../../javascript/app/store/actions';

export interface FramesMessageHideAction {
  type: Actions.FRAMES_MESSAGE_HIDE
}

export interface ShowSerialsAction {
  type: Actions.SHOW_SERIALS,
  payload?: boolean,
}
