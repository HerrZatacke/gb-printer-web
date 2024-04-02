/* eslint-disable default-param-last */
import { Actions } from '../actions';
import updateIfDefined from '../../../tools/updateIfDefined';

const importPadReducer = (value = false, action) => {
  switch (action.type) {
    case Actions.SET_IMPORT_PAD:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined(action.payload.importPad, value);
    default:
      return value;
  }
};

export default importPadReducer;
