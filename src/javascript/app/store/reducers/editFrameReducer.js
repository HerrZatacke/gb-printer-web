/* eslint-disable default-param-last */
import { Actions } from '../actions';

const editFrameReducer = (value = null, action) => {
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
