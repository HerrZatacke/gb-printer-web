const editImageReducer = (value = {}, action) => {
  switch (action.type) {
    case 'EDIT_IMAGE':
      return action.payload;
    case 'UPDATE_EDIT_IMAGE':
      return {
        ...value,
        ...action.payload,
      };
    case 'CANCEL_EDIT_IMAGE':
    case 'UPDATE_IMAGE':
      return {};
    default:
      return value;
  }
};

export default editImageReducer;
