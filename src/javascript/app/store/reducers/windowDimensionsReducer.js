/* eslint-disable default-param-last */
import { Actions } from '../actions';

const windowDimensionsReducer = (value = {
  height: window.innerHeight,
  width: window.innerWidth,
}, action) => {
  switch (action.type) {
    case Actions.WINDOW_DIMENSIONS:
      return action.payload;
    default:
      return value;
  }
};

export default windowDimensionsReducer;
