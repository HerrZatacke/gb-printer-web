const availableTags = (value = [], action) => {
  switch (action.type) {
    case 'SHOW_FILTERS':
      return action.payload;
    case 'HIDE_FILTERS':
    case 'SET_ACTIVE_TAGS':
      return [];
    default:
      return value;
  }
};

export default availableTags;
