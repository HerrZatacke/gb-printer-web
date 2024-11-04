import type { Actions } from '../../javascript/app/store/actions';

export interface ProgressExecutePluginAction {
  type: Actions.EXECUTE_PLUGIN_PROGRESS,
  payload: number,
}

export interface ProgressPrinterProgressAction {
  type: Actions.PRINTER_PROGRESS,
  payload: number,
}
