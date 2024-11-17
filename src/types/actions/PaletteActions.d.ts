import type { Actions } from '../../javascript/app/store/actions';

export interface PaletteEditAction {
  type: Actions.PALETTE_EDIT,
  payload: string,
}

export interface PaletteCloneAction {
  type: Actions.PALETTE_CLONE,
  payload: string,
}
