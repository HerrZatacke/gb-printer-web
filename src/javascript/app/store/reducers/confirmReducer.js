const confirmReducer = (value = [], action) => {
  switch (action.type) {
    case 'CONFIRM_ASK':
      return [
        action.payload,
        ...value,
      ];
    case 'CONFIRM_ANSWERED':
      return value.filter(({ id }) => id !== action.payload);
    default:
      return value;
  }
};

export default confirmReducer;
