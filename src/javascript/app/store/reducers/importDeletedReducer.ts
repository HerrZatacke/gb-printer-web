/* eslint-disable default-param-last */
import { Actions } from '../actions';
import updateIfDefined from '../../../tools/updateIfDefined';
import type { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import type { ImportDeletedAction } from '../../../../types/actions/GlobalActions';

const importDeletedReducer = (value = false, action: ImportDeletedAction | GlobalUpdateAction): boolean => {
  switch (action.type) {
    case Actions.SET_IMPORT_DELETED:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined<boolean>(action.payload?.importDeleted, value);
    default:
      return value;
  }
};

export default importDeletedReducer;
