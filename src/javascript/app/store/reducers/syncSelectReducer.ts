/* eslint-disable default-param-last */
import { Actions } from '../actions';
import type {
  LogStorageSyncDoneAction,
  StorageSyncCancelAction,
  StorageSyncSelectAction,
  StorageSyncStartAction,
} from '../../../../types/actions/LogActions';

const syncSelectReducer = (
  value = false,
  action:
    StorageSyncSelectAction |
    StorageSyncStartAction |
    StorageSyncCancelAction |
    LogStorageSyncDoneAction,
): boolean => {
  switch (action.type) {
    case Actions.STORAGE_SYNC_SELECT:
      return true;
    case Actions.STORAGE_SYNC_START:
    case Actions.STORAGE_SYNC_DONE:
    case Actions.STORAGE_SYNC_CANCEL:
      return false;
    default:
      return value;
  }
};

export default syncSelectReducer;
