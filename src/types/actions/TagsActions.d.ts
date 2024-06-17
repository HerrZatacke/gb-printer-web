import { Actions } from '../../javascript/app/store/actions';

export interface SetActiveTagsAction {
  type: Actions.SET_ACTIVE_TAGS,
  payload?: string[],
}

export interface SetAvailableTagsAction {
  type: Actions.SET_AVAILABLE_TAGS,
  payload?: string[],
}

export interface HideFiltersAction {
  type: Actions.HIDE_FILTERS,
}

export interface ShowFiltersAction {
  type: Actions.SHOW_FILTERS,
}
