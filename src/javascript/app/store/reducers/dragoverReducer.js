/* eslint-disable default-param-last */
import { Actions } from '../actions';

const dragoverReducer = (value = false, action) => {
  switch (action.type) {
    case Actions.IMPORT_DRAGOVER_START:
      return true;
    case Actions.IMPORT_DRAGOVER_END:
      return false;
    default:
      return value;
  }
};

export default dragoverReducer;
