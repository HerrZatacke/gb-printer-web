import {
  ADD_FRAME,
  ADD_IMAGES,
  CONFIRM_ANSWERED,
  CONFIRM_ASK,
  DELETE_FRAME,
  DELETE_IMAGE,
  DELETE_IMAGES,
  PALETTE_DELETE,
} from '../actions';

const confirmReducer = (value = [], action) => {
  switch (action.type) {
    case CONFIRM_ASK: {
      return [
        action.payload,
        ...value,
      ];
    }

    case ADD_FRAME:
    case ADD_IMAGES:
    case DELETE_IMAGE:
    case DELETE_IMAGES:
    case DELETE_FRAME:
    case PALETTE_DELETE:
    case CONFIRM_ANSWERED:
      return value.filter((_, index) => index);
    default:
      return value;
  }
};

export default confirmReducer;
