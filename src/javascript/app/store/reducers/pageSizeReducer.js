import updateIfDefined from '../../../tools/updateIfDefined';
import { GLOBAL_UPDATE, SET_PAGESIZE } from '../actions';

const pageSizeReducer = (value = 0, action) => {
  switch (action.type) {
    case SET_PAGESIZE:
      return action.payload;
    case GLOBAL_UPDATE:
      return updateIfDefined(action.payload.pageSize, value);
    default:
      return value;
  }
};

export default pageSizeReducer;
