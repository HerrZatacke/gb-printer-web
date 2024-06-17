/* eslint-disable default-param-last */
import { Actions } from '../actions';
import updateIfDefined from '../../../tools/updateIfDefined';
import type { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import type { ImportPadAction } from '../../../../types/actions/GlobalActions';

const importPadReducer = (value = false, action: ImportPadAction | GlobalUpdateAction): boolean => {
  switch (action.type) {
    case Actions.SET_IMPORT_PAD:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined<boolean>(action.payload?.importPad, value);
    default:
      return value;
  }
};

export default importPadReducer;
