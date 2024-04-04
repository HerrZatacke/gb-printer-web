/* eslint-disable default-param-last */
import { Actions } from '../actions';

export interface WindowDimensions {
  width: number,
  height: number,
}

interface UpdateWindowDimensionsAction {
  type: Actions.WINDOW_DIMENSIONS,
  payload?: WindowDimensions,
}

const windowDimensionsReducer = (
  value: WindowDimensions = {
    height: window.innerHeight,
    width: window.innerWidth,
  },
  action: UpdateWindowDimensionsAction,
): WindowDimensions => {
  switch (action.type) {
    case Actions.WINDOW_DIMENSIONS:
      return action.payload || value;
    default:
      return value;
  }
};

export default windowDimensionsReducer;
