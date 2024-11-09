import type { Actions } from '../../javascript/app/store/actions';

export interface ConfirmAction {
  type:
    Actions.ADD_FRAME |
    Actions.ADD_IMAGES |
    Actions.DELETE_IMAGE |
    Actions.DELETE_IMAGES |
    Actions.PALETTE_DELETE,
}
