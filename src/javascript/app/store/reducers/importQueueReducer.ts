/* eslint-disable default-param-last */
import { Actions } from '../actions';
import type { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import type { AddImagesAction } from '../../../../types/actions/ImageActions';
import type { AddFrameAction } from '../../../../types/actions/FrameActions';
import type {
  ImportQueueAddAction,
  ImportQueueAddMultiAction,
  ImportQueueCancelAction,
  ImportQueueCancelOneAction,
} from '../../../../types/actions/QueueActions';
import type { ImportItem } from '../../../../types/ImportItem';

const importQueueReducer = (
  importQueue: ImportItem[] = [],
  action:
    AddImagesAction |
    AddFrameAction |
    ImportQueueAddAction |
    ImportQueueAddMultiAction |
    ImportQueueCancelAction |
    ImportQueueCancelOneAction |
    GlobalUpdateAction,
): ImportItem[] => {
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
      return importQueue.filter(({ tempId }) => tempId !== action.payload?.tempId);

    default:
      return importQueue;
  }
};

export default importQueueReducer;
