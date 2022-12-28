import { IMPORTQUEUE_ADD, IMPORTQUEUE_CANCEL, IMPORTQUEUE_CANCEL_ONE } from '../actions';

const importQueueReducer = (importQueue = [], action) => {
  switch (action.type) {
    case IMPORTQUEUE_ADD:
      return [
        ...importQueue,
        action.payload,
      ];

    case IMPORTQUEUE_CANCEL:
      return [];

    case IMPORTQUEUE_CANCEL_ONE:
      return importQueue.filter(({ fileName }) => fileName !== action.payload);

    default:
      return importQueue;
  }
};

export default importQueueReducer;
