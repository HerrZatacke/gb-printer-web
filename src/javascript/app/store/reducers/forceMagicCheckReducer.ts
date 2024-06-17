/* eslint-disable default-param-last */
import { Actions } from '../actions';
import updateIfDefined from '../../../tools/updateIfDefined';
import type { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import type { ForceMagicCheckAction } from '../../../../types/actions/StorageActions';

const forceMagicCheckReducer = (value = true, action: ForceMagicCheckAction | GlobalUpdateAction): boolean => {
  switch (action.type) {
    case Actions.SET_FORCE_MAGIC_CHECK:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined<boolean>(action.payload?.forceMagicCheck, value);
    default:
      return value;
  }
};

export default forceMagicCheckReducer;
