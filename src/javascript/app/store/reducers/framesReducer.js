/* eslint-disable default-param-last */
import uniqueBy from '../../../tools/unique/by';
import { Actions } from '../actions';

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
    case Actions.ADD_FRAME:
      return uniqueBy('id')([action.payload, ...frames]).sort(sortFrames);
    case Actions.DELETE_FRAME:
      return frames.filter(({ id }) => id !== action.payload);
    case Actions.UPDATE_FRAME:
      return [
        ...frames.filter(({ id }) => id !== action.payload.updateId),
        action.payload.data,
      ].sort(sortFrames);
    case Actions.GLOBAL_UPDATE:
      return uniqueBy('id')(action.payload.frames).sort(sortFrames);
    default:
      return frames;
  }
};

export default framesReducer;
