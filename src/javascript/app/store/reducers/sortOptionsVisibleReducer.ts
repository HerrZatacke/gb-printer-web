/* eslint-disable default-param-last */
import { Actions } from '../actions';
import {
  SortOptionsHideAction,
  SortOptionsSetAction,
  SortOptionsSetSortByAction,
} from '../../../../types/actions/SortOptionsActions';

const sortOptionsVisibleReducer = (
  value = false,
  action:
    SortOptionsSetAction |
    SortOptionsHideAction |
    SortOptionsSetSortByAction,
): boolean => {
  switch (action.type) {
    case Actions.SHOW_SORT_OPTIONS:
      return true;
    case Actions.HIDE_SORT_OPTIONS:
    case Actions.SET_SORT_BY:
      return false;
    default:
      return value;
  }
};

export default sortOptionsVisibleReducer;
