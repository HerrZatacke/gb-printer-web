const syncBusyReducer = (value = false, action) => {
  switch (action.type) {
    case 'STORAGE_SYNC_START':
      return true;
    case 'STORAGE_SYNC_DONE':
      return false;
    default:
      return value;
  }
};

export default syncBusyReducer;
