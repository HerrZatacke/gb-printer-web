/* eslint-disable default-param-last */
import { Actions } from '../actions';
import updateIfDefined from '../../../tools/updateIfDefined';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';

interface ImportPadAction {
  type: Actions.SET_IMPORT_PAD,
  payload: boolean,
}

const importPadReducer = (value = false, action: ImportPadAction | GlobalUpdateAction): boolean => {
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
