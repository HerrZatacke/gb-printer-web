const lineBufferReducer = (value = [], action) => {
  switch (action.type) {
    case 'CLEAR_LINES': // make live image disappear
    case 'IMAGE_COMPLETE':
      return [];
    case 'NEW_LINE':
      return [...value, action.payload];
    case 'SET_ALL_LINES':
      return action.payload.lines;
    default:
      return value;
  }
};

export default lineBufferReducer;
