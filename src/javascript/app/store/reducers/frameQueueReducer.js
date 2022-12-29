import { ADD_FRAME, FRAMEQUEUE_ADD, FRAMEQUEUE_CANCEL_ONE } from '../actions';

const frameQueueReducer = (frameQueue = [], action) => {
  switch (action.type) {
    case FRAMEQUEUE_ADD:
      return [
        ...frameQueue,
        action.payload,
      ];

    case FRAMEQUEUE_CANCEL_ONE:
    case ADD_FRAME:
      return frameQueue.filter(({ tempId }) => tempId !== action.payload.tempId);

    default:
      return frameQueue;
  }
};

export default frameQueueReducer;
