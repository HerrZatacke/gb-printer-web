const gitStorageReducer = (value = {}, action) => {
  switch (action.type) {
    case 'SET_GIT_STORAGE':
      return {
        ...value,
        ...action.payload,
      };
    default:
      return value;
  }
};

export default gitStorageReducer;
