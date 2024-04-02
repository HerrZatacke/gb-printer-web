/* eslint-disable default-param-last */
import { Actions } from '../actions';

const bitmapQueueReducer = (bitmapQueue = [], action) => {
  switch (action.type) {
    case Actions.BITMAPQUEUE_ADD:
      return [
        ...bitmapQueue,
        action.payload,
      ];

    case Actions.BITMAPQUEUE_CANCEL:
      return [];

    case Actions.IMPORTQUEUE_ADD:
      return bitmapQueue.filter(({ fileName }) => (
        fileName !== action.payload.fileName
      ));

    default:
      return bitmapQueue;
  }
};

export default bitmapQueueReducer;
