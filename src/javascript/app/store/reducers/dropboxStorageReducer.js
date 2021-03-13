const dropboxStorageReducer = (value = {}, action) => {
  switch (action.type) {
    case 'DROPBOX_LOGOUT':
      return {};
    case 'DROPBOX_SET_TOKENS':
      return { ...action.payload };
    default:
      return value;
  }
};

export default dropboxStorageReducer;
