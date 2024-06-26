/* eslint-disable default-param-last */
import { Actions } from '../actions';
import type {
  ProgressAnimateImagesAction,
  ProgressCreateGifAction,
  ProgressExecutePluginAction,
  ProgressPrinterProgressAction,
} from '../../../../types/actions/ProgressActions';
import type { AddImagesAction } from '../../../../types/actions/ImageActions';
import type { ImportQueueCancelAction } from '../../../../types/actions/QueueActions';
import type { ConfirmAnsweredAction } from '../../../../types/actions/ConfirmActions';

export interface Progress {
  gif: number,
  printer: number,
  plugin: number,
}

const progressReducer = (
  progress: Progress = { gif: 0, printer: 0, plugin: 0 },
  action:
    ProgressAnimateImagesAction |
    ProgressCreateGifAction |
    ProgressExecutePluginAction |
    ProgressPrinterProgressAction |
    AddImagesAction |
    ConfirmAnsweredAction |
    ImportQueueCancelAction,
): Progress => {
  switch (action.type) {
    case Actions.ANIMATE_IMAGES:
      return {
        ...progress,
        gif: 0.01,
      };
    case Actions.CREATE_GIF_PROGRESS:
      return {
        ...progress,
        gif: action.payload,
      };
    case Actions.EXECUTE_PLUGIN_PROGRESS:
      return {
        ...progress,
        plugin: action.payload,
      };
    case Actions.PRINTER_PROGRESS:
      return {
        ...progress,
        printer: action.payload,
      };
    case Actions.ADD_IMAGES:
    case Actions.IMPORTQUEUE_CANCEL:
    case Actions.CONFIRM_ANSWERED:
      return {
        ...progress,
        printer: 0,
      };
    default:
      return progress;
  }
};

export default progressReducer;
