const availableTags = (value = [], action) => {
  switch (action.type) {
    case 'SET_AVAILABLE_TAGS':
      return action.payload.sort((a, b) => (
        a.toLowerCase().localeCompare(b.toLowerCase())
      ));
    default:
      return value;
  }
};

export default availableTags;
