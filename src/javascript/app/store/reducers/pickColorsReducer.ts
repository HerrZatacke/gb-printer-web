/* eslint-disable default-param-last */
import { Actions } from '../actions';
import type { PickColors } from '../../../../types/PickColors';
import type { CancelPickColorsAction, SetPickColorsAction } from '../../../../types/actions/PickColorsActions';
import type { PaletteSetEditAction } from '../../../../types/actions/PaletteActions';


const pickColorsReducer = (
  value: PickColors | null = null,
  action: SetPickColorsAction | CancelPickColorsAction | PaletteSetEditAction,
): PickColors | null => {
  switch (action.type) {
    case Actions.SET_PICK_COLORS:
      return action.payload;
    case Actions.CANCEL_PICK_COLORS:
    case Actions.SET_EDIT_PALETTE:
      return null;
    default:
      return value;
  }
};

export default pickColorsReducer;
