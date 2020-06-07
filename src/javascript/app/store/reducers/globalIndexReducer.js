const globalIndexReducer = (value = 0, action) => {
  switch (action.type) {
    case 'ADD_IMAGE':
      return value + 1;
    case 'GLOBAL_UPDATE':
      return Math.max(action.payload.globalIndex, value) + 1;
    default:
      return value;
  }
};

export default globalIndexReducer;
