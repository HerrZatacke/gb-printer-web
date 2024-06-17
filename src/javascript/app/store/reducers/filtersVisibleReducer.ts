/* eslint-disable default-param-last */
import { Actions } from '../actions';
import type { HideFiltersAction, SetActiveTagsAction, ShowFiltersAction } from '../../../../types/actions/TagsActions';

const filtersVisibleReducer = (
  value = false,
  action: HideFiltersAction | ShowFiltersAction | SetActiveTagsAction,
): boolean => {
  switch (action.type) {
    case Actions.SHOW_FILTERS:
      return true;
    case Actions.HIDE_FILTERS:
    case Actions.SET_ACTIVE_TAGS:
      return false;
    default:
      return value;
  }
};

export default filtersVisibleReducer;
