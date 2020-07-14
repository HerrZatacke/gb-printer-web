const availableTags = (value = [], action) => {
  switch (action.type) {
    case 'SET_AVAILABLE_TAGS':
      return action.payload;
    default:
      return value;
  }
};

export default availableTags;
