/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';
import { GlobalUpdateAction } from './GlobalUpdateAction';

type ActivePaletteAction = {
  type: Actions.PALETTE_SET_ACTIVE,
  payload: string,
} | {
  type: Actions.PALETTE_DELETE,
  payload: {
    activePalette?: string,
    newSelectedPalette?: string,
  }
}

const activePaletteReducer = (value = 'cybl', action: ActivePaletteAction | GlobalUpdateAction): string | undefined => {
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
