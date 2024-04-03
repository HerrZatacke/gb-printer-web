/* eslint-disable default-param-last */
import { Actions } from '../actions';

interface FiltersVisibleAction {
  type: Actions.SHOW_FILTERS | Actions.HIDE_FILTERS | Actions.SET_ACTIVE_TAGS,
}

const filtersVisibleReducer = (value = false, action: FiltersVisibleAction): boolean => {
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
