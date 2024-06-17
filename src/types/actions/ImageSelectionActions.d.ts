import { Actions } from '../../javascript/app/store/actions';

export interface ImageSelectionShiftClickAction {
  type: Actions.IMAGE_SELECTION_SHIFTCLICK,
  payload: string,
  page: number
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
