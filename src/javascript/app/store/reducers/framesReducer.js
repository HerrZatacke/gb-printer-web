const unique = (frames) => (
  frames.filter((frame, index) => (
    frames.findIndex(({ id }) => id === frame.id) === index
  ))
);

const sortFrames = (a, b) => {
  if (a.id < b.id) {
    return -1;
  }

  if (a.id > b.id) {
    return 1;
  }

  return 0;
};

const framesReducer = (frames = [], action) => {
  switch (action.type) {
    case 'ADD_FRAME':
      return unique([action.payload, ...frames]).sort(sortFrames);
    case 'DELETE_FRAME':
      return frames.filter(({ id }) => id !== action.payload);
    case 'GLOBAL_UPDATE':
      return unique([...action.payload.frames, ...frames]).sort(sortFrames);
    default:
      return frames;
  }
};

export default framesReducer;
