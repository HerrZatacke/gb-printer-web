import type { Actions } from '../../javascript/app/store/actions';
import type { Palette } from '../Palette';
import type { PaletteSortMode } from '../../javascript/consts/paletteSortModes';

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

export interface PaletteSetSortOrderAction {
  type: Actions.SET_PALETTE_SORT,
  payload: PaletteSortMode,
}

export interface PaletteEditAction {
  type: Actions.PALETTE_EDIT,
  payload: string,
}

export interface PaletteCancelEditAction {
  type: Actions.PALETTE_CANCEL_EDIT,
}

export interface PaletteCloneAction {
  type: Actions.PALETTE_CLONE,
  payload: string,
}
