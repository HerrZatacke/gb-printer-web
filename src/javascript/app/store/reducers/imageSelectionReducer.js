const imageSelectionReducer = (value = [], action) => {
  switch (action.type) {
    case 'IMAGE_SELECTION_REMOVE':
    case 'DELETE_IMAGE':
      return [...value.filter((hash) => hash !== action.payload)];
    case 'IMAGE_SELECTION_ADD':
      return [...value, action.payload];
    case 'IMAGE_SELECTION_SET':
      return action.payload;
    case 'DELETE_IMAGES':
      return [];
    case 'GLOBAL_UPDATE':
      return action.payload.imageSelection || value;
    default:
      return value;
  }
};

export default imageSelectionReducer;
