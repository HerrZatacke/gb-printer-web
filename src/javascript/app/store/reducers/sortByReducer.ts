/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';

interface SetSortByAction {
  type: Actions.SET_SORT_BY,
  payload: string,
}

const sortByReducer = (value = '', action: SetSortByAction | GlobalUpdateAction): string => {
  switch (action.type) {
    case Actions.SET_SORT_BY:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined(action.payload.sortBy, value);
    default:
      return value;
  }
};

export default sortByReducer;
