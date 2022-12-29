import { ADD_IMAGES, IMPORTQUEUE_ADD, IMPORTQUEUE_CANCEL, IMPORTQUEUE_CANCEL_ONE } from '../actions';

const importQueueReducer = (importQueue = [], action) => {
  switch (action.type) {
    case IMPORTQUEUE_ADD:
      return [
        ...importQueue,
        action.payload,
      ];

    case IMPORTQUEUE_CANCEL:
    case ADD_IMAGES:
      return [];

    case IMPORTQUEUE_CANCEL_ONE:
      return importQueue.filter(({ tempId }) => tempId !== action.payload);

    default:
      return importQueue;
  }
};

export default importQueueReducer;
