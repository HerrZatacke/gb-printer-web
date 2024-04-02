/* eslint-disable default-param-last */
import { Actions } from '../actions';

const isFullscreenReducer = (value = false, action) => {
  switch (action.type) {
    case Actions.SET_IS_FULLSCREEN:
      return action.payload;
    default:
      return value;
  }
};

export default isFullscreenReducer;
