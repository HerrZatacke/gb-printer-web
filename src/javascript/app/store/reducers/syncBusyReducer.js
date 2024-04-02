/* eslint-disable default-param-last */
import { Actions } from '../actions';

const syncBusyReducer = (value = false, action) => {
  switch (action.type) {
    case Actions.STORAGE_SYNC_START:
      return true;
    case Actions.STORAGE_SYNC_DONE:
    case Actions.STORAGE_DIFF_DONE:
      return false;
    default:
      return value;
  }
};

export default syncBusyReducer;
