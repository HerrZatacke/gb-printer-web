/* eslint-disable default-param-last */
import { Actions } from '../actions';
import updateIfDefined from '../../../tools/updateIfDefined';

const importDeletedReducer = (value = false, action) => {
  switch (action.type) {
    case Actions.SET_IMPORT_DELETED:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined(action.payload.importDeleted, value);
    default:
      return value;
  }
};

export default importDeletedReducer;
