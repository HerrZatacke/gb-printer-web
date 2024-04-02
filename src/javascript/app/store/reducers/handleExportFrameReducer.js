/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';

const handleExportFrameReducer = (value = false, action) => {
  switch (action.type) {
    case Actions.SET_HANDLE_EXPORT_FRAME:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined(action.payload.handleExportFrame, value);
    default:
      return value;
  }
};

export default handleExportFrameReducer;
