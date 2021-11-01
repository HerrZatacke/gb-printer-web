import updateIfDefined from '../../../tools/updateIfDefined';
import { GLOBAL_UPDATE, SET_IMPORT_LAST_SEEN } from '../actions';

const importLastSeenReducer = (value = false, action) => {
  switch (action.type) {
    case SET_IMPORT_LAST_SEEN:
      return action.payload;
    case GLOBAL_UPDATE:
      return updateIfDefined(action.payload.importLastSeen, value);
    default:
      return value;
  }
};

export default importLastSeenReducer;
