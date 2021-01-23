const hideDatesReducer = (value = false, action) => {
  switch (action.type) {
    case 'SET_HIDE_DATES':
      return action.payload;
    default:
      return value;
  }
};

export default hideDatesReducer;
