/* eslint-disable default-param-last */
import { Actions } from '../actions';
import { Palette } from '../../../../types/Palette';

interface EditPaletteAction {
  type: Actions.SET_EDIT_PALETTE | Actions.PALETTE_CANCEL_EDIT | Actions.PALETTE_UPDATE,
  payload: Palette,
}

const editPaletteReducer = (value: Palette = {}, action: EditPaletteAction): Palette => {
  switch (action.type) {
    case Actions.SET_EDIT_PALETTE:
      return action.payload;
    case Actions.PALETTE_CANCEL_EDIT:
    case Actions.PALETTE_UPDATE:
      return {};
    default:
      return value;
  }
};

export default editPaletteReducer;
