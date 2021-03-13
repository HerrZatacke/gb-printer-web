const dropboxStorageReducer = (value = {}, action) => {
  switch (action.type) {
    case 'DROPBOX_LOGOUT':
      return {
        use: value.use,
      };
    case 'SET_DROPBOX_STORAGE':
      return {
        ...value,
        ...action.payload,
      };
    default:
      return value;
  }
};

export default dropboxStorageReducer;
