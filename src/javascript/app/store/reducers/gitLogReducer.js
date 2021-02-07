const gitBusyReducer = (value = [], action) => {
  switch (action.type) {
    case 'GITSTORAGE_LOG_ACTION':
      return [
        action.payload,
        ...value,
      ];
    case 'GITSTORAGE_SYNC_DONE':
      return [
        {
          timestamp: (new Date()).getTime() / 1000,
          message: '.',
        },
        ...value,
      ];
    case 'GITSTORAGE_LOG_CLEAR':
      return [];
    default:
      return value;
  }
};

export default gitBusyReducer;
