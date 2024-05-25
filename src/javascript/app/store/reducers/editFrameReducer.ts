/* eslint-disable default-param-last */
import { Actions } from '../actions';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';

export interface EditFrameAction {
  type: Actions.EDIT_FRAME | Actions.CANCEL_EDIT_FRAME | Actions.UPDATE_FRAME,
  payload: string, // frameId
}

const editFrameReducer = (value: string | null = null, action: EditFrameAction | GlobalUpdateAction): string | null => {
  switch (action.type) {
    case Actions.EDIT_FRAME:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
    case Actions.CANCEL_EDIT_FRAME:
    case Actions.UPDATE_FRAME:
      return null;
    default:
      return value;
  }
};

export default editFrameReducer;
