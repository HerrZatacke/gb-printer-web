/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';


const sortByReducer = (value = '', action) => {
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
