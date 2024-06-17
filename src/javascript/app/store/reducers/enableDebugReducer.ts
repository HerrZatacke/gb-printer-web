/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';
import type { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import type { EnableDebugAction } from '../../../../types/actions/GlobalActions';

const enableDebugReducer = (value = false, action: EnableDebugAction | GlobalUpdateAction): boolean => {
  switch (action.type) {
    case Actions.SET_DEBUG:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined<boolean>(action.payload?.enableDebug, value);
    default:
      return value;
  }
};

export default enableDebugReducer;
