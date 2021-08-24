const useSerialsReducer = (value = false, action) => {
  switch (action.type) {
    case 'USE_SERIALS':
      return action.payload;
    default:
      return value;
  }
};

export default useSerialsReducer;
