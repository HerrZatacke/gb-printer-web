/* eslint-disable default-param-last */
import { Actions } from '../actions';
import { Frame } from '../../../../types/Frame';

interface FrameQueueAction {
  type: Actions.FRAMEQUEUE_ADD | Actions.FRAMEQUEUE_CANCEL_ONE | Actions.ADD_FRAME,
  payload: Frame,
}

const frameQueueReducer = (frameQueue: Frame[] = [], action: FrameQueueAction): Frame[] => {
  switch (action.type) {
    case Actions.FRAMEQUEUE_ADD:
      return [
        ...frameQueue,
        action.payload,
      ];

    case Actions.FRAMEQUEUE_CANCEL_ONE:
    case Actions.ADD_FRAME:
      return frameQueue.filter(({ tempId }) => tempId !== action.payload.tempId);

    default:
      return frameQueue;
  }
};

export default frameQueueReducer;
