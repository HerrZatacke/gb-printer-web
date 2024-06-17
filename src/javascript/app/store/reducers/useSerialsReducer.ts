/* eslint-disable default-param-last */
import { Actions } from '../actions';
import type { UseSerialsAction } from '../../../../types/actions/GlobalActions';

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
