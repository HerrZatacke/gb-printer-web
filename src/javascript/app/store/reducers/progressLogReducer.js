const progressLogReducer = (value = { git: [], dropbox: [] }, action) => {
  switch (action.type) {
    case 'GITSTORAGE_LOG_ACTION':
      return {
        ...value,
        git: [
          action.payload,
          ...value.git,
        ],
      };
    case 'GITSTORAGE_SYNC_DONE':
      return {
        ...value,
        git: [
          {
            timestamp: (new Date()).getTime() / 1000,
            message: '.',
          },
          ...value.git,
        ],
      };

    case 'DROPBOX_LOG_ACTION':
      return {
        ...value,
        dropbox: [
          action.payload,
          ...value.dropbox,
        ],
      };
    case 'DROPBOX_SYNC_DONE':
      return {
        ...value,
        dropbox: [
          {
            timestamp: (new Date()).getTime() / 1000,
            message: '.',
          },
          ...value.dropbox,
        ],
      };
    case 'LOG_CLEAR':
      return {
        git: [],
        dropbox: [],
      };
    default:
      return value;
  }
};

export default progressLogReducer;
