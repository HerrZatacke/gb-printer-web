import {
  DROPBOX_LOG_ACTION,
  GITSTORAGE_LOG_ACTION,
  LOG_CLEAR,
  STORAGE_DIFF_DONE,
  STORAGE_SYNC_DONE,
} from '../actions';

const progressLogReducer = (value = { git: [], dropbox: [] }, action) => {
  switch (action.type) {
    case GITSTORAGE_LOG_ACTION:
      return {
        ...value,
        git: [
          action.payload,
          ...value.git,
        ],
      };
    case DROPBOX_LOG_ACTION:
      return {
        ...value,
        dropbox: [
          action.payload,
          ...value.dropbox,
        ],
      };

    case STORAGE_SYNC_DONE:
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

    case STORAGE_DIFF_DONE:
    case LOG_CLEAR:
      return {
        git: [],
        dropbox: [],
      };
    default:
      return value;
  }
};

export default progressLogReducer;
