/* eslint-disable default-param-last */
import { Actions } from '../actions';
import { ImportItem } from '../../../../types/ImportItem';
import { FrameQueueAddAction, FrameQueueCancelOneAction } from '../../../../types/actions/QueueActions';
import { AddFrameAction } from '../../../../types/actions/FrameActions';

const frameQueueReducer = (
  frameQueue: ImportItem[] = [],
  action:
    FrameQueueAddAction |
    FrameQueueCancelOneAction |
    AddFrameAction,
): ImportItem[] => {
  switch (action.type) {
    case Actions.FRAMEQUEUE_ADD:
      return [
        ...frameQueue,
        action.payload,
      ];

    case Actions.FRAMEQUEUE_CANCEL_ONE:
    case Actions.ADD_FRAME:
      return frameQueue.filter(({ tempId }) => tempId !== action.payload?.tempId);

    default:
      return frameQueue;
  }
};

export default frameQueueReducer;
