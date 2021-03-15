const syncSelectReducer = (value = false, action) => {
  switch (action.type) {
    case 'STORAGE_SYNC_SELECT':
      return true;
    case 'STORAGE_SYNC_START':
    case 'STORAGE_SYNC_DONE':
    case 'STORAGE_SYNC_CANCEL':
      return false;
    default:
      return value;
  }
};

export default syncSelectReducer;
