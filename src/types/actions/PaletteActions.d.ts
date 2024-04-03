import { Actions } from '../../javascript/app/store/actions';
import { Palette } from '../Palette';

export interface PaletteDeleteAction {
  type: Actions.PALETTE_DELETE,
  payload: {
    shortName: string,
  },
}

export interface PaletteUpdateAction {
  type: Actions.PALETTE_UPDATE,
  payload: Palette,
}
