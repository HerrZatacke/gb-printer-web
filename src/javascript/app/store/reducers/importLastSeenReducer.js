/* eslint-disable default-param-last */
import { Actions } from '../actions';
import updateIfDefined from '../../../tools/updateIfDefined';

const importLastSeenReducer = (value = false, action) => {
  switch (action.type) {
    case Actions.SET_IMPORT_LAST_SEEN:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined(action.payload.importLastSeen, value);
    default:
      return value;
  }
};

export default importLastSeenReducer;
