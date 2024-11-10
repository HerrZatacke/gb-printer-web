import type { Actions } from '../../javascript/app/store/actions';
import type { Image } from '../Image';

export interface ImageSelectionShiftClickAction {
  type: Actions.IMAGE_SELECTION_SHIFTCLICK,
  payload: {
    hash: string,
    images: Image[], // list of images which can currently be selected,
    page: number
  },
}

export interface ImageSelectionAddAction {
  type: Actions.IMAGE_SELECTION_ADD,
  payload: string,
}

export interface ImageSelectionRemoveAction {
  type: Actions.IMAGE_SELECTION_REMOVE,
  payload: string,
}

export interface ImageSelectionSetAction {
  type: Actions.IMAGE_SELECTION_SET
  payload?: string[],
}
