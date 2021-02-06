const gitStatusReducer = (value = { busy: false, progress: 0 }, action) => {
  switch (action.type) {
    case 'GITSTORAGE_PROGRESS':
      return action.payload;
    case 'GITSTORAGE_SYNC_START':
      return {
        ...value,
        busy: true,
      };
    case 'GITSTORAGE_SYNC_DONE':
      return {
        ...value,
        busy: false,
      };
    default:
      return value;
  }
};

export default gitStatusReducer;
