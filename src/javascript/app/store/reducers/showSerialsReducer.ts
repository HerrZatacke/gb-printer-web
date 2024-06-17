/* eslint-disable default-param-last */
import { Actions } from '../actions';
import type { ShowSerialsAction } from '../../../../types/actions/GlobalActions';

const showSerialsReducer = (value = false, action: ShowSerialsAction): boolean => {
  switch (action.type) {
    case Actions.SHOW_SERIALS:
      return !!action.payload;
    default:
      return value;
  }
};

export default showSerialsReducer;
