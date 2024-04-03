import { Actions } from '../../javascript/app/store/actions';

export interface ImageSelectionActionAddRemove {
  type: Actions.IMAGE_SELECTION_REMOVE | Actions.IMAGE_SELECTION_ADD,
  payload: string,
}

export interface ImageSelectionSet {
  type: Actions.IMAGE_SELECTION_SET
  payload: string[],
}
