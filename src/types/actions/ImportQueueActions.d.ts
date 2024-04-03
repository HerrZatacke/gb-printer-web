import { Actions } from '../../javascript/app/store/actions';
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
