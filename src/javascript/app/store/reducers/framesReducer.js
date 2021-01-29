const framesReducer = (frames = [], action) => {
  switch (action.payload) {
    case 'SET_FRAMES':
      return action.payload;
    default:
      return frames;
  }
};

export default framesReducer;
