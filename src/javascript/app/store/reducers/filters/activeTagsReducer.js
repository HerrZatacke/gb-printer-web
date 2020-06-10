const activeTags = (value = [], action) => {
  switch (action.type) {
    case 'SET_ACTIVE_TAGS':
      return action.payload;
    case 'UPDATE_IMAGE':
      return action.activeTags;
    default:
      return value;
  }
};

export default activeTags;
