/* eslint-disable default-param-last */
import { Actions } from '../actions';

const showSerialsReducer = (value = false, action) => {
  switch (action.type) {
    case Actions.SHOW_SERIALS:
      return action.payload;
    default:
      return value;
  }
};

export default showSerialsReducer;
