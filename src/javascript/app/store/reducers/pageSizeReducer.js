/* eslint-disable default-param-last */
import { Actions } from '../actions';
import updateIfDefined from '../../../tools/updateIfDefined';

const pageSizeReducer = (value = 0, action) => {
  switch (action.type) {
    case Actions.SET_PAGESIZE:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined(action.payload.pageSize, value);
    default:
      return value;
  }
};

export default pageSizeReducer;
