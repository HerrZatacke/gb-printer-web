const dropboxTokenReducer = (value = null, action) => {
  switch (action.type) {
    case 'DROPBOX_LOGOUT':
      return null;
    default:
      return value;
  }
};

export default dropboxTokenReducer;
