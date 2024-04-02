/* eslint-disable default-param-last */
import { Actions } from '../actions';

const filtersVisibleReducer = (value = false, action) => {
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
