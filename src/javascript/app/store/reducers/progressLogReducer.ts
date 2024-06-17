/* eslint-disable default-param-last */
import { Actions } from '../actions';
import type {
  LogClearAction,
  LogDropboxAction,
  LogGitStorageAction,
  LogStorageDiffDoneAction,
  LogStorageSyncDoneAction, ProgressLog,
} from '../../../../types/actions/LogActions';

const progressLogReducer = (
  value: ProgressLog = { git: [], dropbox: [] },
  action:
    LogGitStorageAction |
    LogDropboxAction |
    LogStorageSyncDoneAction |
    LogStorageDiffDoneAction |
    LogClearAction,
): ProgressLog => {
  switch (action.type) {
    case Actions.GITSTORAGE_LOG_ACTION:
      return {
        ...value,
        git: [
          action.payload,
          ...value.git,
        ],
      };
    case Actions.DROPBOX_LOG_ACTION:
      return {
        ...value,
        dropbox: [
          action.payload,
          ...value.dropbox,
        ],
      };

    case Actions.STORAGE_SYNC_DONE:
      return {
        ...value,
        [action.payload.storageType]: [
          {
            timestamp: (new Date()).getTime() / 1000,
            message: '.',
          },
          ...value[action.payload.storageType],
        ],
      };

    case Actions.STORAGE_DIFF_DONE:
    case Actions.LOG_CLEAR:
      return {
        git: [],
        dropbox: [],
      };
    default:
      return value;
  }
};

export default progressLogReducer;
