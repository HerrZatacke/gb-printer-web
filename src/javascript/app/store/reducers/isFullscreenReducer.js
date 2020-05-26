const isFullscreenReducer = (value = false, action) => {
  switch (action.type) {
    case 'SET_IS_FULLSCREEN':
      return action.payload;
    default:
      return value;
  }
};

export default isFullscreenReducer;
