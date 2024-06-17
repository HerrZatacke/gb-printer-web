import { Actions } from '../../javascript/app/store/actions';
import { PickColors } from '../PickColors';

export interface SetPickColorsAction {
  type: Actions.SET_PICK_COLORS,
  payload: PickColors,
}

export interface CancelPickColorsAction {
  type: Actions.CANCEL_PICK_COLORS,
}
