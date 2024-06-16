import updateIfDefined from '../../../tools/updateIfDefined';
import { GLOBAL_UPDATE, SET_PALETTE_SORT } from '../actions';

const sortPalettesReducer = (value = '', action) => {
  switch (action.type) {
    case SET_PALETTE_SORT:
      return action.payload;
    case GLOBAL_UPDATE:
      return updateIfDefined(action.payload.sortPalettes, value);
    default:
      return value;
  }
};

export default sortPalettesReducer;
