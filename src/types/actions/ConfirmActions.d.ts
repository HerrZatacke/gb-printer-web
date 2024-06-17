import { Actions } from '../../javascript/app/store/actions';
import { Dialog } from '../Dialog';

export interface ConfirmAskAction {
  type: Actions.CONFIRM_ASK,
  payload: Dialog,
}

export interface ConfirmAction {
  type:
    Actions.ADD_FRAME |
    Actions.ADD_IMAGES |
    Actions.DELETE_IMAGE |
    Actions.DELETE_IMAGES |
    Actions.PALETTE_DELETE,
}

export interface ConfirmAnsweredAction {
  type: Actions.CONFIRM_ANSWERED,
}
