import { Actions } from '../../javascript/app/store/actions';
import { PrinterInfo } from '../Printer';

export interface PrinterRemoteCallAction {
  type: Actions.REMOTE_CALL_FUNCTION,
}

export interface PrinterTimedOutAction {
  type: Actions.HEARTBEAT_TIMED_OUT,
}

export interface PrinterFunctionsReceivedAction {
  type: Actions.PRINTER_FUNCTIONS_RECEIVED,
  payload: object[]
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

