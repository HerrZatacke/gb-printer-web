const sortOptionsVisibleReducer = (value = false, action) => {
  switch (action.type) {
    case 'SHOW_SORT_OPTIONS':
      return true;
    case 'HIDE_SORT_OPTIONS':
    case 'CLOSE_OVERLAY':
    case 'SET_SORT_BY':
      return false;
    default:
      return value;
  }
};

export default sortOptionsVisibleReducer;
