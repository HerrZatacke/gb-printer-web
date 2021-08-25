const showSerialsReducer = (value = false, action) => {
  switch (action.type) {
    case 'SHOW_SERIALS':
      return action.payload;
    default:
      return value;
  }
};

export default showSerialsReducer;
