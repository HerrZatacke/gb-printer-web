import { Actions } from '../../javascript/app/store/actions';
import { Palette } from '../Palette';

export interface PaletteSetActiveAction {
  type: Actions.PALETTE_SET_ACTIVE,
  payload: string,
}

export interface PaletteDeleteAction {
  type: Actions.PALETTE_DELETE,
  payload: {
    shortName: string,
    activePalette?: string,
    newSelectedPalette?: string,
  },
}

export interface PaletteUpdateAction {
  type: Actions.PALETTE_UPDATE,
  payload: Palette,
}

export interface PaletteSetEditAction {
  type: Actions.SET_EDIT_PALETTE,
  payload: Palette,
}

export interface PaletteCancelEditAction {
  type: Actions.PALETTE_CANCEL_EDIT,
}