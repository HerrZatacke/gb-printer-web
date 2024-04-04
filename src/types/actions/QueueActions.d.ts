import { Actions } from '../../javascript/app/store/actions';
import { QueueImage } from '../QueueImage';
import { Frame } from '../Frame';

import { ImportItem } from '../ImportItem';

export interface ImportQueueAddAction {
  type: Actions.IMPORTQUEUE_ADD,
  payload: ImportItem,
}

export interface ImportQueueAddMultiAction {
  type: Actions.IMPORTQUEUE_ADD_MULTI,
  payload: ImportItem[],
}

export interface ImportQueueCancelAction {
  type: Actions.IMPORTQUEUE_CANCEL,
}

export interface ImportQueueCancelOneAction {
  type: Actions.IMPORTQUEUE_CANCEL_ONE,
  payload: {
    tempId: string,
  },
}

export interface BitmapQueueAddAction {
  type: Actions.BITMAPQUEUE_ADD,
  payload: QueueImage,
}

export interface BitmapQueueCancelAction {
  type: Actions.BITMAPQUEUE_CANCEL,
}
export interface FrameQueueAddAction {
  type: Actions.FRAMEQUEUE_ADD,
  payload: Frame,
}

export interface FrameQueueCancelOneAction {
  type: Actions.FRAMEQUEUE_CANCEL_ONE,
  payload: Frame,
}
