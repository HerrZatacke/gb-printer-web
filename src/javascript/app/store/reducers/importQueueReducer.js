import { IMPORTQUEUE_ADD, IMPORTQUEUE_CANCEL } from '../actions';

const importQueueReducer = (importQueue = [], action) => {
  switch (action.type) {
    case IMPORTQUEUE_ADD:
      return [
        ...importQueue,
        action.payload,
      ];

    case IMPORTQUEUE_CANCEL:
      return [];

    default:
      return importQueue;
  }
};

export default importQueueReducer;
