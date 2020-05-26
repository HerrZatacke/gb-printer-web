const currentPageReducer = (value = 0, action) => {
  switch (action.type) {
    case 'SET_CURRENTPAGE':
      return action.payload;
    default:
      return value;
  }
};

export default currentPageReducer;
