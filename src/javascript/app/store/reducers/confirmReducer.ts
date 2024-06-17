/* eslint-disable default-param-last */
import { Actions } from '../actions';
import type {
  ConfirmAction,
  ConfirmAskAction,
  ConfirmAnsweredAction,
} from '../../../../types/actions/ConfirmActions';
import type { Dialog } from '../../../../types/Dialog';
import type { DeleteFrameAction } from '../../../../types/actions/FrameActions';

const confirmReducer = (
  value: Dialog[] = [],
  action: ConfirmAskAction | ConfirmAction | ConfirmAnsweredAction | DeleteFrameAction,
): Dialog[] => {
  switch (action.type) {
    case Actions.CONFIRM_ASK: {
      return [
        action.payload,
        ...value,
      ];
    }

    case Actions.ADD_FRAME:
    case Actions.ADD_IMAGES:
    case Actions.DELETE_IMAGE:
    case Actions.DELETE_IMAGES:
    case Actions.DELETE_FRAME:
    case Actions.PALETTE_DELETE:
    case Actions.CONFIRM_ANSWERED:
      return value.filter((_, index) => index);
    default:
      return value;
  }
};

export default confirmReducer;
