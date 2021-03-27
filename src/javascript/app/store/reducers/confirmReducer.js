const confirmReducer = (value = [], action) => {
  switch (action.type) {
    case 'CONFIRM_ASK': {
      return [
        action.payload,
        ...value,
      ];
    }

    case 'ADD_IMAGES':
    case 'ADD_FRAME':
    case 'DELETE_IMAGE':
    case 'DELETE_IMAGES':
    case 'PALETTE_DELETE':
    case 'CONFIRM_ANSWERED':
      return value.filter((_, index) => index);
    default:
      return value;
  }
};

export default confirmReducer;
