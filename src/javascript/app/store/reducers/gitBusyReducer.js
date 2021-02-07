const gitBusyReducer = (value = false, action) => {
  switch (action.type) {
    case 'GITSTORAGE_SYNC_START':
      return true;
    case 'GITSTORAGE_SYNC_DONE':
      return false;
    default:
      return value;
  }
};

export default gitBusyReducer;
