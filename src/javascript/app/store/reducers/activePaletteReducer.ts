/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';

interface ActivePaletteAction {
  type: Actions.PALETTE_SET_ACTIVE | Actions.GLOBAL_UPDATE | Actions.PALETTE_DELETE,
  payload: {
    activePalette?: string,
    newSelectedPalette?: string,
  }
}

const activePaletteReducer = (value = 'cybl', action: ActivePaletteAction) => {
  switch (action.type) {
    case Actions.PALETTE_SET_ACTIVE:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined<string>(action.payload.activePalette, value);
    case Actions.PALETTE_DELETE:
      return action.payload.newSelectedPalette || value;
    default:
      return value;
  }
};

export default activePaletteReducer;
