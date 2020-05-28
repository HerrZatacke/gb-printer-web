const lastSelectedImageReducer = (value = null, action) => {
  switch (action.type) {
    case 'IMAGE_SELECTION_ADD':
    case 'IMAGE_SELECTION_REMOVE':
      return action.payload;
    case 'SET_CURRENTPAGE':
    case 'DELETE_IMAGE':
    case 'DELETE_IMAGES':
    case 'SET_CURRENT_GALLERY_VIEW':
      return null;
    default:
      return value;
  }
};

export default lastSelectedImageReducer;
