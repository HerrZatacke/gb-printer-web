/* eslint-disable default-param-last */
import { ExportFrameMode } from 'gb-image-decoder';
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import { HandleExportFrameAction } from '../../../../types/actions/FrameActions';

const handleExportFrameReducer = (
  value = ExportFrameMode.FRAMEMODE_KEEP,
  action: HandleExportFrameAction | GlobalUpdateAction,
): ExportFrameMode => {
  switch (action.type) {
    case Actions.SET_HANDLE_EXPORT_FRAME:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined<ExportFrameMode>(action.payload?.handleExportFrame, value);
    default:
      return value;
  }
};

export default handleExportFrameReducer;
