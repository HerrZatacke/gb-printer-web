const lastSelectedImageReducer = (value = null, action) => {
  switch (action.type) {
    case 'IMAGE_SELECTION_ADD':
    case 'IMAGE_SELECTION_REMOVE':
      return action.payload;
    case 'DELETE_IMAGE':
    case 'DELETE_IMAGES':
      return null;
    default:
      return value;
  }
};

export default lastSelectedImageReducer;
