/* eslint-disable default-param-last */
import { Actions } from '../actions';

const editPaletteReducer = (value = {}, action) => {
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
