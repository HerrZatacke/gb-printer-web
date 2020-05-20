const dragoverReducer = (value = false, action) => {
  switch (action.type) {
    case 'IMPORT_DRAGOVER_START':
      return true;
    case 'IMPORT_DRAGOVER_END':
      return false;
    default:
      return value;
  }
};

export default dragoverReducer;
