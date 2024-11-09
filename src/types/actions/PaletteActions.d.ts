import type { Actions } from '../../javascript/app/store/actions';
import type { Palette } from '../Palette';

export interface PaletteDeleteAction {
  type: Actions.PALETTE_DELETE,
  payload: string,
}

export interface PaletteUpdateAction {
  type: Actions.PALETTE_UPDATE,
  payload: Palette,
}

export interface PaletteEditAction {
  type: Actions.PALETTE_EDIT,
  payload: string,
}

export interface PaletteCloneAction {
  type: Actions.PALETTE_CLONE,
  payload: string,
}
