/* eslint-disable default-param-last */
import { Actions } from '../actions';

export interface QueueImage {
  imageData: ImageData,
  scaleFactor: number,
  width: number,
  height: number,
  fileName: string,
  lastModified: number | null,
}

interface BitmapQueueAction {
  type: Actions.BITMAPQUEUE_ADD | Actions.BITMAPQUEUE_CANCEL | Actions.IMPORTQUEUE_ADD,
  payload: QueueImage,
}

const bitmapQueueReducer = (bitmapQueue: QueueImage[] = [], action: BitmapQueueAction): QueueImage[] => {
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
