/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import { PaletteDeleteAction, PaletteSetActiveAction } from '../../../../types/actions/PaletteActions';

const activePaletteReducer = (
  value = 'cybl',
  action:
    PaletteSetActiveAction |
    PaletteDeleteAction |
    GlobalUpdateAction,
): string => {
  switch (action.type) {
    case Actions.PALETTE_SET_ACTIVE:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined<string>(action.payload?.activePalette, value);
    case Actions.PALETTE_DELETE:
      return action.payload.newSelectedPalette || value;
    default:
      return value;
  }
};

export default activePaletteReducer;
