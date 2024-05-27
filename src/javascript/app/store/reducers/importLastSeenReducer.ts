/* eslint-disable default-param-last */
import { Actions } from '../actions';
import updateIfDefined from '../../../tools/updateIfDefined';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import { ImportLastSeenAction } from '../../../../types/actions/GlobalActions';

const importLastSeenReducer = (value = false, action: ImportLastSeenAction | GlobalUpdateAction): boolean => {
  switch (action.type) {
    case Actions.SET_IMPORT_LAST_SEEN:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined<boolean>(action.payload?.importLastSeen, value);
    default:
      return value;
  }
};

export default importLastSeenReducer;
