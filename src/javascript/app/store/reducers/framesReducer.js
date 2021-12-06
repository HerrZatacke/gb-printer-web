import uniqueBy from '../../../tools/unique/by';
import { ADD_FRAME, DELETE_FRAME, GLOBAL_UPDATE, UPDATE_FRAME } from '../actions';

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
    case ADD_FRAME:
      return uniqueBy('id')([action.payload, ...frames]).sort(sortFrames);
    case DELETE_FRAME:
      return frames.filter(({ id }) => id !== action.payload);
    case UPDATE_FRAME:
      return [
        ...frames.filter(({ id }) => id !== action.payload.updateId),
        action.payload.data,
      ].sort(sortFrames);
    case GLOBAL_UPDATE:
      return uniqueBy('id')(action.payload.frames).sort(sortFrames);
    default:
      return frames;
  }
};

export default framesReducer;
