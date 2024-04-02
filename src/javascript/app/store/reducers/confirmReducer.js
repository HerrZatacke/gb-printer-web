/* eslint-disable default-param-last */
import { Actions } from '../actions';

const confirmReducer = (value = [], action) => {
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
