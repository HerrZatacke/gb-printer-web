import { HIDE_SORT_OPTIONS, SET_SORT_BY, SHOW_SORT_OPTIONS } from '../actions';

const sortOptionsVisibleReducer = (value = false, action) => {
  switch (action.type) {
    case SHOW_SORT_OPTIONS:
      return true;
    case HIDE_SORT_OPTIONS:
    case SET_SORT_BY:
      return false;
    default:
      return value;
  }
};

export default sortOptionsVisibleReducer;
