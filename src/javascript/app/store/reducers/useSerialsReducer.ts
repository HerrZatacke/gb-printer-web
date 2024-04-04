/* eslint-disable default-param-last */
import { Actions } from '../actions';

interface UseSerialsAction {
  type: Actions.USE_SERIALS,
  payload?: boolean,
}

const useSerialsReducer = (
  value = false,
  action: UseSerialsAction,
): boolean => {
  switch (action.type) {
    case Actions.USE_SERIALS:
      return !!action.payload;
    default:
      return value;
  }
};

export default useSerialsReducer;
