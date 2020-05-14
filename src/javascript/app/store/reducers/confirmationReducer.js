const confirmationReducer = (value = {}, action) => {
  switch (action.type) {
    case 'SET_CONFIRMATION':
      return action.payload;
    case 'CLEAR_CONFIRMATION':
      return {};
    default:
      return value;
  }
};

export default confirmationReducer;
