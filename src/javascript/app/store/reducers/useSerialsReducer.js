/* eslint-disable default-param-last */
import { Actions } from '../actions';

const useSerialsReducer = (value = false, action) => {
  switch (action.type) {
    case Actions.USE_SERIALS:
      return action.payload;
    default:
      return value;
  }
};

export default useSerialsReducer;
