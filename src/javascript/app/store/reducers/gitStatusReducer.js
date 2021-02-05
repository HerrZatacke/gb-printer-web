const gitStatusReducer = (value = { busy: false, progress: 0 }, action) => {
  switch (action.type) {
    case 'GITSTORAGE_PROGRESS':
      return action.payload;
    default:
      return value;
  }
};

export default gitStatusReducer;
