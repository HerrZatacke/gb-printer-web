import updateIfDefined from '../../../tools/updateIfDefined';
import { GLOBAL_UPDATE, SET_IMPORT_DELETED } from '../actions';

const importDeletedReducer = (value = false, action) => {
  switch (action.type) {
    case SET_IMPORT_DELETED:
      return action.payload;
    case GLOBAL_UPDATE:
      return updateIfDefined(action.payload.importDeleted, value);
    default:
      return value;
  }
};

export default importDeletedReducer;
