const globalIndexReducer = (value = 0, action) => {
  switch (action.type) {
    case 'ADD_IMAGE':
      return value + 1;
    default:
      return value;
  }
};

export default globalIndexReducer;
