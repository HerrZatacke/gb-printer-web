import type { Actions } from '../../javascript/app/store/actions';
import type { PrinterInfo } from '../Printer';
import type { PrinterFunction } from '../../javascript/consts/printerFunction';

export interface PrinterRemoteCallAction {
  type: Actions.REMOTE_CALL_FUNCTION,
  payload: PrinterFunction,
}

export interface PrinterTimedOutAction {
  type: Actions.HEARTBEAT_TIMED_OUT,
}

export interface PrinterFunctionsReceivedAction {
  type: Actions.PRINTER_FUNCTIONS_RECEIVED,
  payload: PrinterFunction[]
}

export interface PrinterDataReceivedAction {
  type: Actions.PRINTER_DATA_RECEIVED,
  payload: PrinterInfo,
}

export interface PrinterResetAction {
  type: Actions.PRINTER_RESET,
}

export interface PrinterSetParamsAction {
  type: Actions.SET_PRINTER_PARAMS,
  payload: string,
}

export interface PrinterSetUrlAction {
  type: Actions.SET_PRINTER_URL,
  payload: string,
}

