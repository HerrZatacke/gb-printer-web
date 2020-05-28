const imageSelectionReducer = (value = [], action) => {
  switch (action.type) {
    case 'IMAGE_SELECTION_REMOVE':
      return [...value.filter((hash) => hash !== action.payload)];
    case 'IMAGE_SELECTION_ADD':
      return [...value, action.payload];
    case 'IMAGE_SELECTION_SET':
      return action.payload;
    case 'DELETE_IMAGES':
      return [];
    default:
      return value;
  }
};

export default imageSelectionReducer;
