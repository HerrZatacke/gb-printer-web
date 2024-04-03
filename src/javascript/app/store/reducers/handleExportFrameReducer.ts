/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import { ExportFrameMode } from '../../../consts/exportFrameModes';

interface HandleExportFrameAction {
  type: Actions.SET_HANDLE_EXPORT_FRAME,
  payload: ExportFrameMode,
}

const handleExportFrameReducer = (
  value = ExportFrameMode.FRAMEMODE_KEEP,
  action: HandleExportFrameAction | GlobalUpdateAction,
): ExportFrameMode => {
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
