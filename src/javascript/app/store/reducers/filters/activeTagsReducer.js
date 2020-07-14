const activeTags = (value = [], action) => {
  switch (action.type) {
    case 'SET_ACTIVE_TAGS':
      return action.payload;
    case 'SET_AVAILABLE_TAGS':
      return value.filter((tag) => action.payload.includes(tag));
    default:
      return value;
  }
};

export default activeTags;
