import updateIfDefined from '../../../tools/updateIfDefined';
import { GLOBAL_UPDATE, SET_IMPORT_PAD } from '../actions';

const importPadReducer = (value = false, action) => {
  switch (action.type) {
    case SET_IMPORT_PAD:
      return action.payload;
    case GLOBAL_UPDATE:
      return updateIfDefined(action.payload.importPad, value);
    default:
      return value;
  }
};

export default importPadReducer;
