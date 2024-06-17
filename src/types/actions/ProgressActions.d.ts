import type { Actions } from '../../javascript/app/store/actions';

export interface ProgressAnimateImagesAction {
  type: Actions.ANIMATE_IMAGES,
}

export interface ProgressCreateGifAction {
  type: Actions.CREATE_GIF_PROGRESS,
  payload: number,
}

export interface ProgressExecutePluginAction {
  type: Actions.EXECUTE_PLUGIN_PROGRESS,
  payload: number,
}

export interface ProgressPrinterProgressAction {
  type: Actions.PRINTER_PROGRESS,
  payload: number,
}
