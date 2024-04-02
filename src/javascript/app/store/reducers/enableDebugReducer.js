/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';

const enableDebugReducer = (value = false, action) => {
  switch (action.type) {
    case Actions.SET_DEBUG:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined(action.payload.enableDebug, value);
    default:
      return value;
  }
};

export default enableDebugReducer;
