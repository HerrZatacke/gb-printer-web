/* eslint-disable default-param-last */
import { Actions } from '../actions';
import updateIfDefined from '../../../tools/updateIfDefined';
import type { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import type { HideDatesAction } from '../../../../types/actions/GlobalActions';

const hideDatesReducer = (value = false, action: HideDatesAction | GlobalUpdateAction): boolean => {
  switch (action.type) {
    case Actions.SET_HIDE_DATES:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined<boolean>(action.payload?.hideDates, value);
    default:
      return value;
  }
};

export default hideDatesReducer;
