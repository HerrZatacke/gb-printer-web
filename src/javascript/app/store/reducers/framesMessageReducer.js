import { FRAMES_MESSAGE_HIDE, FRAMES_MESSAGE_SHOW } from '../actions';

const framesMessageReducer = (framesMessage = 0, action) => {
  switch (action.type) {
    case FRAMES_MESSAGE_SHOW:
      return 1;
    case FRAMES_MESSAGE_HIDE:
      return 2;
    default:
      return framesMessage;
  }
};

export default framesMessageReducer;
