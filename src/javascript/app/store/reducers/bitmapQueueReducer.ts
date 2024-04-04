/* eslint-disable default-param-last */
import { Actions } from '../actions';
import {
  BitmapQueueAddAction,
  BitmapQueueCancelAction,
  ImportQueueAddAction,
} from '../../../../types/actions/QueueActions';
import { QueueImage } from '../../../../types/QueueImage';


const bitmapQueueReducer = (
  bitmapQueue: QueueImage[] = [],
  action:
    BitmapQueueAddAction |
    BitmapQueueCancelAction |
    ImportQueueAddAction,
): QueueImage[] => {
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
