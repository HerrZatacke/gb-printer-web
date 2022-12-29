import { FRAMEQUEUE_ADD, FRAMEQUEUE_CANCEL_ONE } from '../actions';

const frameQueueReducer = (frameQueue = [], action) => {
  switch (action.type) {
    case FRAMEQUEUE_ADD:
      return [
        ...frameQueue,
        action.payload,
      ];

    case FRAMEQUEUE_CANCEL_ONE:
      return frameQueue.filter(({ tempId }) => tempId !== action.payload);


    default:
      return frameQueue;
  }
};

export default frameQueueReducer;
