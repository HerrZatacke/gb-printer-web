import { Actions } from '../../javascript/app/store/actions';

export interface Dialog {
  message: string,
  questions: () => object[],
  confirm: () => void,
  deny: () => void,
}

export interface ComfirmAskAction {
  type: Actions.CONFIRM_ASK,
  payload: Dialog,
}

export interface ComfirmAction {
  type:
    Actions.ADD_FRAME |
    Actions.ADD_IMAGES |
    Actions.DELETE_IMAGE |
    Actions.DELETE_IMAGES |
    Actions.DELETE_FRAME |
    Actions.PALETTE_DELETE,
}

export interface ComfirmAnsweredAction {
  type: Actions.CONFIRM_ANSWERED,
}
