/* eslint-disable default-param-last */
import { Actions } from '../actions';
import updateIfDefined from '../../../tools/updateIfDefined';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';

interface ImportLastSeenAction {
  type: Actions.SET_IMPORT_LAST_SEEN,
  payload: boolean,
}
const importLastSeenReducer = (value = false, action: ImportLastSeenAction | GlobalUpdateAction): boolean => {
  switch (action.type) {
    case Actions.SET_IMPORT_LAST_SEEN:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined(action.payload.importLastSeen, value);
    default:
      return value;
  }
};

export default importLastSeenReducer;
