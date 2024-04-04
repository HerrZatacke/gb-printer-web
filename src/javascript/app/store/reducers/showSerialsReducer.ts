/* eslint-disable default-param-last */
import { Actions } from '../actions';

interface ShowSerialsAction {
  type: Actions.SHOW_SERIALS,
  payload?: boolean,
}

const showSerialsReducer = (value = false, action: ShowSerialsAction): boolean => {
  switch (action.type) {
    case Actions.SHOW_SERIALS:
      return !!action.payload;
    default:
      return value;
  }
};

export default showSerialsReducer;
