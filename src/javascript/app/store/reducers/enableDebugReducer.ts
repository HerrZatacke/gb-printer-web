/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';

interface EnableDebugAction {
  type: Actions.SET_DEBUG,
  payload: boolean,
}

const enableDebugReducer = (value = false, action: EnableDebugAction | GlobalUpdateAction): boolean => {
  switch (action.type) {
    case Actions.SET_DEBUG:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined(action.payload.enableDebug, value);
    default:
      return value;
  }
};

export default enableDebugReducer;
