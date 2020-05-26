const pageSizeReducer = (value = 0, action) => {
  switch (action.type) {
    case 'SET_PAGESIZE':
      return action.payload;
    default:
      return value;
  }
};

export default pageSizeReducer;
