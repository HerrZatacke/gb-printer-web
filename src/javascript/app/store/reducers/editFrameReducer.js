import {
  EDIT_FRAME,
  GLOBAL_UPDATE,
  CANCEL_EDIT_FRAME,
  UPDATE_FRAME,
} from '../actions';

const editFrameReducer = (value = null, action) => {
  switch (action.type) {
    case EDIT_FRAME:
      return action.payload;
    case GLOBAL_UPDATE:
    case CANCEL_EDIT_FRAME:
    case UPDATE_FRAME:
      return null;
    default:
      return value;
  }
};

export default editFrameReducer;
