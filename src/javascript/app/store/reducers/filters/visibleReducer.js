const visibleReducer = (value = false, action) => {
  switch (action.type) {
    case 'SHOW_FILTERS':
      return true;
    case 'HIDE_FILTERS':
    case 'SET_ACTIVE_TAGS':
      return false;
    default:
      return value;
  }
};

export default visibleReducer;
