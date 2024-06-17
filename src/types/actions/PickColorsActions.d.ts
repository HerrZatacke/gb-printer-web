import type { Actions } from '../../javascript/app/store/actions';
import type { PickColors } from '../PickColors';

export interface SetPickColorsAction {
  type: Actions.SET_PICK_COLORS,
  payload: PickColors,
}

export interface CancelPickColorsAction {
  type: Actions.CANCEL_PICK_COLORS,
}
