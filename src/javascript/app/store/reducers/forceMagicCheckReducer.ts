/* eslint-disable default-param-last */
import { Actions } from '../actions';
import updateIfDefined from '../../../tools/updateIfDefined';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';

interface ForceMagicCheckAction {
  type: Actions.SET_FORCE_MAGIC_CHECK,
  payload: boolean,
}

const forceMagicCheckReducer = (value = true, action: ForceMagicCheckAction | GlobalUpdateAction): boolean => {
  switch (action.type) {
    case Actions.SET_FORCE_MAGIC_CHECK:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined(action.payload.forceMagicCheck, value);
    default:
      return value;
  }
};

export default forceMagicCheckReducer;
