const importQueueSizeReducer = (value = 0, action) => {
  switch (action.type) {
    case 'IMPORT_QUEUE_SIZE':
      return action.payload;
    default:
      return value;
  }
};

export default importQueueSizeReducer;
