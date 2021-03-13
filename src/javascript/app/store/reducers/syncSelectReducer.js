const syncSelectReducer = (value = false, action) => {
  switch (action.type) {
    case 'STORAGE_SYNC_SELECT':
      return true;
    case 'STORAGE_SYNC_START':
    case 'STORAGE_SYNC_DONE':
      return false;
    default:
      return value;
  }
};

export default syncSelectReducer;
