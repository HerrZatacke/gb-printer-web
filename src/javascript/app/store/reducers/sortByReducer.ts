/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';
import type { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import type { SortOptionsSetSortByAction } from '../../../../types/actions/SortOptionsActions';

const sortByReducer = (value = '', action: SortOptionsSetSortByAction | GlobalUpdateAction): string => {
  switch (action.type) {
    case Actions.SET_SORT_BY:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined<string>(action.payload?.sortBy, value);
    default:
      return value;
  }
};

export default sortByReducer;
