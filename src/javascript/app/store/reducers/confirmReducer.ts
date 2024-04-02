/* eslint-disable default-param-last */
import { Actions } from '../actions';

interface Dialog {
  message: string,
  questions: () => object[],
  confirm: () => void,
  deny: () => void,
}

interface ComfirmAction {
  type:
    Actions.CONFIRM_ASK |
    Actions.ADD_FRAME |
    Actions.ADD_IMAGES |
    Actions.DELETE_IMAGE |
    Actions.DELETE_IMAGES |
    Actions.DELETE_FRAME |
    Actions.PALETTE_DELETE |
    Actions.CONFIRM_ANSWERED,
  payload: Dialog,
}

const confirmReducer = (value: Dialog[] = [], action: ComfirmAction): Dialog[] => {
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
