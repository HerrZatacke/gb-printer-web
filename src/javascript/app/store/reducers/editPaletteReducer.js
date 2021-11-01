import { PALETTE_CANCEL_EDIT, PALETTE_UPDATE, SET_EDIT_PALETTE } from '../actions';

const editPaletteReducer = (value = {}, action) => {
  switch (action.type) {
    case SET_EDIT_PALETTE:
      return action.payload;
    case PALETTE_CANCEL_EDIT:
    case PALETTE_UPDATE:
      return {};
    default:
      return value;
  }
};

export default editPaletteReducer;
