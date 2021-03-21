const confirmReducer = (value = [], action) => {
  switch (action.type) {
    case 'CONFIRM_ASK':
      return [
        action.payload,
        ...value,
      ];
    case 'DELETE_IMAGE':
    case 'DELETE_IMAGES':
    case 'PALETTE_DELETE':
    case 'CONFIRM_ANSWERED':
      return value.filter(({ id }) => id !== action.confirmId);
    default:
      return value;
  }
};

export default confirmReducer;
