/* eslint-disable default-param-last */
import { Actions } from '../actions';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import { CancelEditFrameAction, EditFrameAction, UpdateFrameAction } from '../../../../types/actions/FrameActions';

const editFrameReducer = (
  value: string | null = null,
  action: CancelEditFrameAction | EditFrameAction | GlobalUpdateAction | UpdateFrameAction,
): string | null => {
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
