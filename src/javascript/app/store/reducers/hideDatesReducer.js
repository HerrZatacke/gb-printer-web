/* eslint-disable default-param-last */
import { Actions } from '../actions';
import updateIfDefined from '../../../tools/updateIfDefined';

const hideDatesReducer = (value = false, action) => {
  switch (action.type) {
    case Actions.SET_HIDE_DATES:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined(action.payload.hideDates, value);
    default:
      return value;
  }
};

export default hideDatesReducer;
