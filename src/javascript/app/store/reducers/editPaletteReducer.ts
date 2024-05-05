/* eslint-disable default-param-last */
import { Actions } from '../actions';
import { Palette } from '../../../../types/Palette';
import { PaletteCancelEditAction, PaletteSetEditAction, PaletteUpdateAction } from '../../../../types/actions/PaletteActions';

const editPaletteReducer = (
  value: Palette | null = null,
  action:
    PaletteSetEditAction |
    PaletteCancelEditAction |
    PaletteUpdateAction,
): Palette | null => {
  switch (action.type) {
    case Actions.SET_EDIT_PALETTE:
      return action.payload;
    case Actions.PALETTE_CANCEL_EDIT:
    case Actions.PALETTE_UPDATE:
      return null;
    default:
      return value;
  }
};

export default editPaletteReducer;
