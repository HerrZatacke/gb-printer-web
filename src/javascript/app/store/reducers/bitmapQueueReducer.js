import { BITMAPQUEUE_ADD, BITMAPQUEUE_CANCEL, IMPORTQUEUE_ADD } from '../actions';

const bitmapQueueReducer = (bitmapQueue = [], action) => {
  switch (action.type) {
    case BITMAPQUEUE_ADD:
      return [
        ...bitmapQueue,
        action.payload,
      ];

    case BITMAPQUEUE_CANCEL:
      return [];

    case IMPORTQUEUE_ADD:
      return bitmapQueue.filter(({ fileName }) => (
        fileName !== action.payload.fileName
      ));

    default:
      return bitmapQueue;
  }
};

export default bitmapQueueReducer;
