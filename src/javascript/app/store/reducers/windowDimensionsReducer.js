import { WINDOW_DIMENSIONS } from '../actions';

const windowDimensionsReducer = (value = {
  height: window.innerHeight,
  width: window.innerWidth,
}, action) => {
  switch (action.type) {
    case WINDOW_DIMENSIONS:
      return action.payload;
    default:
      return value;
  }
};

export default windowDimensionsReducer;
