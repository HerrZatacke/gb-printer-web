import { Actions } from '../../javascript/app/store/actions';

export interface SortOptionsSetAction {
  type: Actions.SHOW_SORT_OPTIONS,
}

export interface SortOptionsHideAction {
  type: Actions.HIDE_SORT_OPTIONS,
}

export interface SortOptionsSetSortByAction {
  type: Actions.SET_SORT_BY,
}
