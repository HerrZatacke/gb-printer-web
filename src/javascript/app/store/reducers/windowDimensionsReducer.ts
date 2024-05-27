/* eslint-disable default-param-last */
import { Actions } from '../actions';
import { UpdateWindowDimensionsAction } from '../../../../types/actions/GlobalActions';
import { WindowDimensions } from '../../../../types/WindowDimensions';

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
