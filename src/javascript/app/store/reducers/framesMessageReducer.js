/* eslint-disable default-param-last */
import { Actions } from '../actions';

const framesMessageReducer = (framesMessage = 0, action) => {
  switch (action.type) {
    case Actions.FRAMES_MESSAGE_SHOW:
      return 1;
    case Actions.FRAMES_MESSAGE_HIDE:
      return 2;
    default:
      return framesMessage;
  }
};

export default framesMessageReducer;
