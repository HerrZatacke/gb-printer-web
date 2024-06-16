import { CANCEL_PICK_COLORS, SET_EDIT_PALETTE, SET_PICK_COLORS } from '../actions';

const pickColorsReducer = (value = null, action) => {
  switch (action.type) {
    case SET_PICK_COLORS:
      return action.payload;
    case CANCEL_PICK_COLORS:
    case SET_EDIT_PALETTE:
      return null;
    default:
      return value;
  }
};

export default pickColorsReducer;
