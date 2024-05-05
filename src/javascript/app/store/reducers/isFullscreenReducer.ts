/* eslint-disable default-param-last */
import { Actions } from '../actions';

export interface IsFullscreenAction {
  type: Actions.SET_IS_FULLSCREEN,
  payload?: boolean,
}

const isFullscreenReducer = (value = false, action: IsFullscreenAction): boolean => {
  switch (action.type) {
    case Actions.SET_IS_FULLSCREEN:
      return !!action.payload;
    default:
      return value;
  }
};

export default isFullscreenReducer;