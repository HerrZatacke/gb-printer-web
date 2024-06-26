import type { Actions } from '../../javascript/app/store/actions';

export interface TrashShowHideAction {
  type: Actions.SHOW_HIDE_TRASH,
  payload?: boolean,
}

export interface UpdateTrashcountAction {
  type: Actions.UPDATE_TRASH_COUNT,
}

export interface TrashCountFramesAction {
  type: Actions.SET_TRASH_COUNT_FRAMES,
  payload: number,
}

export interface TrashCountImagesAction {
  type: Actions.SET_TRASH_COUNT_IMAGES,
  payload: number,
}
