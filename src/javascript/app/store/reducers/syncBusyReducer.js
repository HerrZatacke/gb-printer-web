import { STORAGE_DIFF_DONE, STORAGE_SYNC_DONE, STORAGE_SYNC_START } from '../actions';

const syncBusyReducer = (value = false, action) => {
  switch (action.type) {
    case STORAGE_SYNC_START:
      return true;
    case STORAGE_SYNC_DONE:
    case STORAGE_DIFF_DONE:
      return false;
    default:
      return value;
  }
};

export default syncBusyReducer;
