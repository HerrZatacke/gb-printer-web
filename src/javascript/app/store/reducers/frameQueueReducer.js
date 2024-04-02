/* eslint-disable default-param-last */
import { Actions } from '../actions';

const frameQueueReducer = (frameQueue = [], action) => {
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
