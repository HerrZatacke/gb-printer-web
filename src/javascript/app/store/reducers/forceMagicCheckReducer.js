import { GLOBAL_UPDATE, SET_FORCE_MAGIC_CHECK } from '../actions';
import updateIfDefined from '../../../tools/updateIfDefined';

const forceMagicCheckReducer = (value = true, action) => {
  switch (action.type) {
    case SET_FORCE_MAGIC_CHECK:
      return action.payload;
    case GLOBAL_UPDATE:
      return updateIfDefined(action.payload.forceMagicCheck, value);
    default:
      return value;
  }
};

export default forceMagicCheckReducer;
