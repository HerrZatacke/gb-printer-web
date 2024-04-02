/* eslint-disable default-param-last */
import { Actions } from '../actions';
import updateIfDefined from '../../../tools/updateIfDefined';

const forceMagicCheckReducer = (value = true, action) => {
  switch (action.type) {
    case Actions.SET_FORCE_MAGIC_CHECK:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined(action.payload.forceMagicCheck, value);
    default:
      return value;
  }
};

export default forceMagicCheckReducer;
