/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';
import type { EnableImageGroupsAction } from '../../../../types/actions/GlobalActions';
import type { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';

const enableImageGroupsReducer = (value = false, action: EnableImageGroupsAction | GlobalUpdateAction): boolean => {
  switch (action.type) {
    case Actions.SET_ENABLE_IMAGE_GROUPS:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined<boolean>(action.payload?.enableDebug, value);
    default:
      return value;
  }
};

export default enableImageGroupsReducer;
