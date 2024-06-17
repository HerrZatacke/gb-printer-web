/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';
import { PaletteSetSortOrderAction } from '../../../../types/actions/PaletteActions';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import { PaletteSortMode } from '../../../consts/paletteSortModes';

const sortPalettesReducer = (
  value: PaletteSortMode = PaletteSortMode.DEFAULT_ASC,
  action: PaletteSetSortOrderAction | GlobalUpdateAction,
): PaletteSortMode => {
  switch (action.type) {
    case Actions.SET_PALETTE_SORT:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined<PaletteSortMode>(action.payload?.sortPalettes, value);
    default:
      return value;
  }
};

export default sortPalettesReducer;
