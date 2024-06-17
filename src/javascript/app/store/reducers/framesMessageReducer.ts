/* eslint-disable default-param-last */
import { Actions } from '../actions';
import type { FramesMessageHideAction } from '../../../../types/actions/GlobalActions';

const framesMessageReducer = (framesMessage = 0, action: FramesMessageHideAction): number => {
  switch (action.type) {
    // value 1 is being set by cleanState
    // case Actions.FRAMES_MESSAGE_SHOW:
    //   return 1;
    case Actions.FRAMES_MESSAGE_HIDE:
      return 2;
    default:
      return framesMessage;
  }
};

export default framesMessageReducer;
