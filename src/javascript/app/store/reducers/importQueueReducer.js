/* eslint-disable default-param-last */
import { Actions } from '../actions';


const importQueueReducer = (importQueue = [], action) => {
  switch (action.type) {
    case Actions.IMPORTQUEUE_ADD:
      return [
        ...importQueue,
        action.payload,
      ];

    case Actions.IMPORTQUEUE_ADD_MULTI:
      return [
        ...importQueue,
        ...action.payload,
      ];

    case Actions.IMPORTQUEUE_CANCEL:
    case Actions.ADD_IMAGES:
      return [];

    case Actions.IMPORTQUEUE_CANCEL_ONE:
    case Actions.ADD_FRAME:
      return importQueue.filter(({ tempId }) => tempId !== action.payload.tempId);

    default:
      return importQueue;
  }
};

export default importQueueReducer;
