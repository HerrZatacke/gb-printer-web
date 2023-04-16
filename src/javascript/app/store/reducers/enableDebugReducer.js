import updateIfDefined from '../../../tools/updateIfDefined';
import { GLOBAL_UPDATE, SET_DEBUG } from '../actions';

const enableDebugReducer = (value = false, action) => {
  switch (action.type) {
    case SET_DEBUG:
      return action.payload;
    case GLOBAL_UPDATE:
      return updateIfDefined(action.payload.enableDebug, value);
    default:
      return value;
  }
};

export default enableDebugReducer;
